import { CartItem, StoredFile } from "@/types";
import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  category: mysqlEnum("category", [
    "games",
    "accessories",
    "electronics",
    "wearables",
  ])
    .notNull()
    .default("electronics"),
  subcategory: varchar("subcategory", { length: 191 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  inventory: int("inventory").notNull().default(0),
  rating: int("rating").notNull().default(0),
  tags: json("tags").$type<string[] | null>().default(null),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  clientSecret: varchar("clientSecret", { length: 191 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
