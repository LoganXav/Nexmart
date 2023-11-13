"use server";

import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { getProductsSchema } from "@/lib/validations/product";
import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm";
import { z } from "zod";

export async function filterProductsAction(query: string) {
  if (query.length === 0) return null;

  // HANDLES SEARCH QUERYING OF PRODUCTS
  const filteredProducts = await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
    })
    .from(products)
    .where(like(products.name, `%${query}%`))
    .orderBy(desc(products.createdAt))
    .limit(10);

  const productsByCategory = Object.values(products.category.enumValues).map(
    (category) => ({
      category,
      products: filteredProducts.filter(
        (product) => product.category === category
      ),
    })
  );

  return productsByCategory;
}

export async function getProductsAction(
  rawInput: z.infer<typeof getProductsSchema>
) {
  try {
    const input = getProductsSchema.parse(rawInput);

    // HANDLES FORMATING OF THE FILTER AND SORTING PARAMETERS
    const [column, order] = (input.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined
    ]) ?? ["createdAt", "desc"];
    const [minPrice, maxPrice] = input.price_range?.split("-") ?? [];
    const categories =
      (input.categories?.split(".") as Product["category"][]) ?? [];
    const subcategories = input.subcategories?.split(".") ?? [];

    // INITIATES A DB TRANSACTION TO ENSURE THE GETPRODUCTSACTION WITH THE FILTERING IS DONE AS A SINGLE TRANSACTION
    const { items, count } = await db.transaction(async (tx) => {
      const items = await tx
        .select()
        .from(products)
        .limit(input.limit)
        .offset(input.offset)
        .where(
          and(
            categories.length
              ? inArray(products.category, categories)
              : undefined,
            subcategories.length
              ? inArray(products.subcategory, subcategories)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined
          )
        )
        // The query groups the results by the product's id. This ensures that only distinct products are selected.

        .groupBy(products.id)
        .orderBy(
          column && column in products
            ? order === "asc"
              ? asc(products[column])
              : desc(products[column])
            : desc(products.createdAt)
        );

      const count = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(products)
        .where(
          and(
            categories.length
              ? inArray(products.category, categories)
              : undefined,
            subcategories.length
              ? inArray(products.subcategory, subcategories)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        items,
        count,
      };
    });
    return {
      items,
      count,
    };
  } catch (err) {
    console.error(err);
    throw err instanceof Error
      ? err.message
      : err instanceof z.ZodError
      ? err.issues.map((issue) => issue.message).join("\n")
      : new Error("Unknown error.");
  }
}
