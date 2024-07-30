// import { CartItem, CheckoutItem, StoredFile } from "@/types";
// import { relations } from "drizzle-orm";
// import { boolean, decimal, int, json, mysqlEnum, mysqlTable, serial, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// export const products = mysqlTable("products", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 191 }).notNull(),
//   description: text("description"),
//   images: json("images").$type<StoredFile[] | null>().default(null),
//   category: mysqlEnum("category", ["games", "accessories", "electronics", "wearables"]).notNull().default("electronics"),
//   subcategory: varchar("subcategory", { length: 191 }),
//   price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
//   inventory: int("inventory").notNull().default(0),
//   rating: int("rating").notNull().default(0),
//   tags: json("tags").$type<string[] | null>().default(null),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Product = typeof products.$inferSelect;
// export type NewProduct = typeof products.$inferInsert;

// export const carts = mysqlTable("carts", {
//   id: serial("id").primaryKey(),
//   paymentIntentId: varchar("paymentIntentId", { length: 191 }),
//   clientSecret: varchar("clientSecret", { length: 191 }),
//   items: json("items").$type<CartItem[] | null>().default(null),
//   closed: boolean("closed").notNull().default(false),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Cart = typeof carts.$inferSelect;
// export type NewCart = typeof carts.$inferInsert;

// // Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
// export const orders = mysqlTable("orders", {
//   id: serial("id").primaryKey(),
//   items: json("items").$type<CheckoutItem[] | null>().default(null),
//   quantity: int("quantity"),
//   amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
//   stripePaymentIntentId: varchar("stripePaymentIntentId", {
//     length: 191,
//   }).notNull(),
//   stripePaymentIntentStatus: varchar("stripePaymentIntentStatus", {
//     length: 191,
//   }).notNull(),
//   name: varchar("name", { length: 191 }),
//   email: varchar("email", { length: 191 }),
//   addressId: int("addressId"),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Order = typeof orders.$inferSelect;
// export type NewOrder = typeof orders.$inferInsert;

// // Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
// export const addresses = mysqlTable("addresses", {
//   id: serial("id").primaryKey(),
//   line1: varchar("line1", { length: 191 }),
//   line2: varchar("line2", { length: 191 }),
//   city: varchar("city", { length: 191 }),
//   state: varchar("state", { length: 191 }),
//   postalCode: varchar("postalCode", { length: 191 }),
//   country: varchar("country", { length: 191 }),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Address = typeof addresses.$inferSelect;
// export type NewAddress = typeof addresses.$inferInsert;

// // Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
// export const payments = mysqlTable("payments", {
//   id: serial("id").primaryKey(),
//   storeId: int("storeId").notNull(),
//   stripeAccountId: varchar("stripeAccountId", { length: 191 }).notNull(),
//   stripeAccountCreatedAt: int("stripeAccountCreatedAt"),
//   stripeAccountExpiresAt: int("stripeAccountExpiresAt"),
//   detailsSubmitted: boolean("detailsSubmitted").notNull().default(false),
//   createdAt: timestamp("createdAt").defaultNow(),
// });

// export type Payment = typeof payments.$inferSelect;
// export type NewPayment = typeof payments.$inferInsert;

// // export const paymentsRelations = relations(payments, ({ one }) => ({
// //   store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
// // }));

import { CartItem, CheckoutItem, StoredFile } from "@/types";
import { relations } from "drizzle-orm";
import { boolean, decimal, integer, json, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["games", "accessories", "electronics", "wearables"]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  category: categoryEnum("popularity"),
  subcategory: varchar("category", { length: 191 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  inventory: integer("inventory").notNull().default(0),
  rating: integer("rating").notNull().default(0),
  tags: json("tags").$type<string[] | null>().default(null),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  paymentIntentId: varchar("paymentIntentId", { length: 191 }),
  clientSecret: varchar("clientSecret", { length: 191 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  items: json("items").$type<CheckoutItem[] | null>().default(null),
  quantity: integer("quantity"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", {
    length: 191,
  }).notNull(),
  stripePaymentIntentStatus: varchar("stripePaymentIntentStatus", {
    length: 191,
  }).notNull(),
  name: varchar("name", { length: 191 }),
  email: varchar("email", { length: 191 }),
  addressId: integer("addressId"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 191 }),
  line2: varchar("line2", { length: 191 }),
  city: varchar("city", { length: 191 }),
  state: varchar("state", { length: 191 }),
  postalCode: varchar("postalCode", { length: 191 }),
  country: varchar("country", { length: 191 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  storeId: integer("storeId").notNull(),
  stripeAccountId: varchar("stripeAccountId", { length: 191 }).notNull(),
  stripeAccountCreatedAt: integer("stripeAccountCreatedAt"),
  stripeAccountExpiresAt: integer("stripeAccountExpiresAt"),
  detailsSubmitted: boolean("detailsSubmitted").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// Uncomment and modify the following relations as needed
// export const paymentsRelations = relations(payments, ({ one }) => ({
//   store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
// }));
