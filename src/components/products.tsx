"use client";
import * as React from "react";

import { type Product } from "@/db/schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import type { Option } from "@/types";
import { cn, toTitleCase } from "@/lib/utils";
import { getSubcategories, sortOptions } from "@/config/products";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { MultiSelect } from "./multi-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ProductCard } from "./cards/product-card";
import { PaginationButton } from "./pagers/pagination-button";

interface ProductProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[];
  pageCount: number;
  category?: Product["category"];
  categories?: Product["category"][];
}

export function Products({
  products,
  pageCount,
  category,
  categories,
  ...props
}: ProductProps) {
  const id = React.useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // URL PARAMS
  const page = searchParams?.get("page") ?? "1";
  const per_page = searchParams?.get("per_page") ?? "8";
  const sort = searchParams?.get("sort") ?? "createdAt.desc";
  const categoriesParam = searchParams?.get("categories");
  const subcategoriesParam = searchParams?.get("subcategories");

  // CREATE QUERY STRING
  // constructor for the search or filter params passed to it
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  // PRICE FILTER
  // debounces the price range input from the user and creates a new query string to filter the products
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 500,
  ]);
  const debouncedPrice = useDebounce(priceRange, 500);

  React.useEffect(() => {
    const [min, max] = debouncedPrice;
    startTransition(() => {
      const newQueryString = createQueryString({
        price_range: `${min}-${max}`,
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPrice]);

  // CATEGORY FILTER
  // links and unlinks the slected categories with a dot and creates a new query string with the selected categories to filter the products
  const [selectedCategories, setSelectedCategories] = React.useState<
    Option[] | null
  >(
    categoriesParam
      ? categoriesParam.split(".").map((c) => ({
          label: toTitleCase(c),
          value: c,
        }))
      : null
  );

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        categories: selectedCategories?.length
          ? // Join categories with a dot to make search params more readable
            selectedCategories.map((c) => c.value).join(".")
          : null,
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  // SUBCATEGORY FILTER
  // same as selected categories above
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<
    Option[] | null
  >(
    subcategoriesParam
      ? subcategoriesParam.split(".").map((c) => ({
          label: toTitleCase(c),
          value: c,
        }))
      : null
  );

  const subcategories = getSubcategories(category);

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        subcategories: selectedSubcategories?.length
          ? selectedSubcategories.map((s) => s.value).join(".")
          : null,
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategories]);

  return (
    <section className="flex flex-col space-y-6" {...props}>
      <div className="flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="Filter products" size="sm" disabled={isPending}>
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="px-1">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="flex flex-1 flex-col gap-5 overflow-hidden px-1">
              <div className="space-y-4">
                <h3 className="text-sm font-medium tracking-wide text-foreground">
                  Price reange ($)
                </h3>
                <Slider
                  variant="range"
                  thickness="thin"
                  defaultValue={[0, 500]}
                  max={500}
                  step={1}
                  value={priceRange}
                  onValueChange={(value: typeof priceRange) =>
                    setPriceRange(value)
                  }
                />
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={priceRange[1]}
                    className="h-9"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPriceRange([value, priceRange[1]]);
                    }}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={priceRange[0]}
                    max={500}
                    className="h-9"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPriceRange([priceRange[0], value]);
                    }}
                  />
                </div>
              </div>
              {categories?.length ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    Categories
                  </h3>
                  <MultiSelect
                    placeholder="Select categories"
                    selected={selectedCategories}
                    setSelected={setSelectedCategories}
                    options={categories.map((c) => ({
                      label: toTitleCase(c),
                      value: c,
                    }))}
                  />
                </div>
              ) : null}
              {/* {category ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium tracking-wide text-foreground">
                    Subcategories
                  </h3>
                  <MultiSelect
                    placeholder="Select subcategories"
                    selected={selectedSubcategories}
                    setSelected={setSelectedSubcategories}
                    options={subcategories}
                  />
                </div>
              ) : null} */}
            </div>
            <div>
              <Separator className="my-4" />
              <SheetFooter>
                <Button
                  aria-label="Clear filters"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `${pathname}?${createQueryString({
                          price_range: 0 - 100,
                          categories: null,
                          subcategories: null,
                        })}`
                      );
                      setPriceRange([0, 100]);
                      setSelectedCategories(null);
                      setSelectedSubcategories(null);
                    });
                  }}
                  disabled={isPending}
                >
                  Clear Filters
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort products" size="sm" disabled={isPending}>
              Sort
              <ChevronDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 bg-white z-50"
            forceMount
          >
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className={cn(option.value === sort && "font-bold")}
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        sort: option.value,
                      })}`,
                      {
                        scroll: false,
                      }
                    );
                  });
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!isPending && !products.length ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center text-2xl font-bold">No products found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new products
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length ? (
        <PaginationButton
          pageCount={pageCount}
          page={page}
          per_page={per_page}
          sort={sort}
          createQueryString={createQueryString}
        />
      ) : null}
    </section>
  );
}
