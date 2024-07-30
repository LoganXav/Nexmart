import type { Metadata } from "next";
import { type Product } from "@/db/schema";
import { env } from "@/env.mjs";

import { toTitleCase } from "@/lib/utils";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Products } from "@/components/products";
import { Shell } from "@/components/shells/shell";
import { getProductsAction } from "@/app/_actions/product";

interface CategoryPageProps {
  params: {
    category: Product["category"];
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = params;
  const { page, per_page, sort, subcategories, price_range } = searchParams;

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8;
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0;

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    categories: category,
    subcategories: typeof subcategories === "string" ? subcategories : null,
    price_range: typeof price_range === "string" ? price_range : null,
  });

  const pageCount = Math.ceil(productsTransaction.count / limit);

  return (
    <Shell>
      <PageHeader id="category-page-header" aria-labelledby="category-page-header-heading">
        <PageHeaderHeading size="sm">{toTitleCase(category)}</PageHeaderHeading>
        <PageHeaderDescription size="sm">{`Buy ${category} from the best stores`}</PageHeaderDescription>
      </PageHeader>
      <Products id="category-page-products" aria-labelledby="category-page-products-heading" products={productsTransaction.items} pageCount={pageCount} category={category} />
    </Shell>
  );
}
