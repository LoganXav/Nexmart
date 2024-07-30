DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('games', 'accessories', 'electronics', 'wearables');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"line1" varchar(191),
	"line2" varchar(191),
	"city" varchar(191),
	"state" varchar(191),
	"postalCode" varchar(191),
	"country" varchar(191),
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"paymentIntentId" varchar(191),
	"clientSecret" varchar(191),
	"items" json DEFAULT 'null'::json,
	"closed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"items" json DEFAULT 'null'::json,
	"quantity" integer,
	"amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"stripePaymentIntentId" varchar(191) NOT NULL,
	"stripePaymentIntentStatus" varchar(191) NOT NULL,
	"name" varchar(191),
	"email" varchar(191),
	"addressId" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"storeId" integer NOT NULL,
	"stripeAccountId" varchar(191) NOT NULL,
	"stripeAccountCreatedAt" integer,
	"stripeAccountExpiresAt" integer,
	"detailsSubmitted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"description" text,
	"images" json DEFAULT 'null'::json,
	"popularity" "category",
	"category" varchar(191),
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"tags" json DEFAULT 'null'::json,
	"createdAt" timestamp DEFAULT now()
);
