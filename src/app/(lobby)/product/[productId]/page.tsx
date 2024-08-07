import { ProductCard } from "@/components/cards/product-card";
import { Breadcrumbs } from "@/components/pagers/breadcrumbs";
import { Shell } from "@/components/shells/shell";
import { db } from "@/db";
import { products } from "@/db/schema";
import { env } from "@/env.mjs";
import { formatPrice, toTitleCase } from "@/lib/utils";
import { and, desc, eq, not } from "drizzle-orm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { AddToCartForm } from "@/components/forms/add-to-cart-form";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const productId = Number(params.productId);

  const product = await db.query.products.findFirst({
    columns: {
      name: true,
      description: true,
    },
    where: eq(products.id, productId),
  });

  if (!product) {
    return {};
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(product.name),
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number(params.productId);

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
      category: true,
    },
    where: eq(products.id, productId),
  });

  if (!product) {
    notFound();
  }

  const similarProductsQuery = db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      images: products.images,
      category: products.category,
      inventory: products.inventory,
    })
    .from(products)
    .limit(4)
    .orderBy(desc(products.inventory));

  if (product.category !== null) {
    similarProductsQuery.where(and(eq(products.category, product.category), not(eq(products.id, productId))));
  } else {
    similarProductsQuery.where(not(eq(products.id, productId)));
  }

  const similarProducts = await similarProductsQuery;

  return (
    <Shell>
      <Breadcrumbs
        segments={[
          {
            title: "Products",
            href: "/products",
          },
          {
            title: toTitleCase(product.category) as string,
            href: `/products?category=${product.category}`,
          },
          {
            title: product.name,
            href: `/product/${product.id}`,
          },
        ]}
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images ?? []}
          options={{
            loop: true,
          }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            <p className="text-base text-muted-foreground">{formatPrice(product.price)}</p>
          </div>
          <Separator className="my-1.5" />
          <AddToCartForm productId={productId} />
          <Separator className="mt-5" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>{product.description ?? "No description is available for this product."}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {similarProducts?.length > 0 ? (
        <div className="overflow-hidden md:pt-6">
          <h2 className="line-clamp-1 flex-1 text-2xl font-bold">You might also like these {toTitleCase(product.category)} products</h2>
          <div className="overflow-x-auto pb-2 pt-6">
            <div className="flex w-fit gap-4">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} className="min-w-[260px]" />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}
