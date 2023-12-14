import type { Icons } from "@/components/icons";
import { Product } from "@/db/schema";
import {
  cartItemSchema,
  cartLineItemSchema,
  checkoutItemSchema,
} from "@/lib/validations/cart";
import { type z } from "zod";
import type Stripe from "stripe";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface Category {
  title: Product["category"];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  subcategories: Subcategory[];
}

export interface Subcategory {
  title: string;
  description?: string;
  image?: string;
  slug: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface StoredFile {
  id: string;
  name: string;
  url: string;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export type CartItem = z.infer<typeof cartItemSchema>;

export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;

export type StripePaymentStatus = Stripe.PaymentIntent.Status;

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  title: string;
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[];
}

//------> DUMMY TYPES

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  imageUrl: string;
  emailAddresses?: [{ id: number; emailAddress: string }];
  primaryEmailAddressId?: number;
}

//------>
