import { Shell } from "@/components/shells/shell";
import { Balancer } from "react-wrap-balancer";
import { productCategories } from "@/config/products";
import { CategoryCard } from "@/components/cards/category-card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/cards/product-card";
import { products } from "@/db/schema";
import { db } from "@/db";

export default async function IndexPage() {
  const someProducts = await db.select().from(products).limit(8);

  return (
    <Shell className="max-w-6xl pt-0 md:pt-0">
      <section id="hero" aria-labelledby="hero-heading" className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 py-12 text-center md:pt-32">
        <Balancer as="h1" className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Nexmart Lobby
        </Balancer>
        <Balancer className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">Built with Nextjs, Typescript, Zod, Radix UI</Balancer>
      </section>
      <section id="categories" aria-labelledby="categories-heading" className="space-y-6 py-8 md:pt-10 lg:pt-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Categories</h2>
          <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">Find the best skateboarding gears from stores around the world</Balancer>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productCategories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </section>
      <section id="featured-products" aria-labelledby="featured-products-heading" className="space-y-6 overflow-hidden py-8 md:pt-12 lg:pt-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 overflow-visible text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Featured products</h2>
          <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">Explore products from around the world</Balancer>
        </div>
        <div className="flex flex-col space-y-10">
          {someProducts?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {someProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center py-8">
              <div className="w-full flex h-full flex-col items-center justify-center space-y-1 pt-10 mx-auto">
                <Icons.product className="mb-4 h-16 w-16 text-muted-foreground" aria-hidden="true" />
                <div className="text-xl font-medium text-muted-foreground">No products found</div>
                <div className="text-sm text-muted-foreground">Please try again later</div>
              </div>
            </div>
          )}

          <Link
            href="/products"
            className={cn(
              buttonVariants({
                className: "mx-auto",
              })
            )}
          >
            View all products
            <span className="sr-only">View all products</span>
          </Link>
        </div>
      </section>
    </Shell>
  );
}
