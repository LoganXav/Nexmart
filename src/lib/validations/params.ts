import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("10"),
});

export const productsSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  categories: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
});

export const ordersSearchParamsSchema = searchParamsSchema.extend({
  sort: z.string().optional().default("createdAt.desc"),
  status: z.string().optional(),
});
