import { type Metadata } from "next";
import { env } from "@/env.mjs";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Products } from "@/components/products";
import { Shell } from "@/components/shells/shell";
import { productsSearchParamsSchema } from "@/lib/validations/params";
import { getProductsAction } from "@/app/_actions/product";
import { products } from "@/db/schema";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Products",
  description: "Buy products from our stores",
};

interface ProductsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { page, per_page, sort, categories, subcategories, price_range } =
    productsSearchParamsSchema.parse(searchParams);

  // PRODUCTS TRANSACTION QUERY PARAMETERS
  const pageAsNumber = Number(page);
  // performs an extra check to see if the parameters have been converted to a number
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const perPageAsNumber = Number(per_page);
  // Number of items per page
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort,
    categories,
    subcategories,
    price_range,
  });

  const pageCount = Math.ceil(productsTransaction.count / limit);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        categories={Object.values(products.category.enumValues)}
      />
    </Shell>
  );
}
