import type { Icons } from "@/components/icons";

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

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// DUMMY TYPES

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  imageUrl: string;
  emailAddresses?: [{ id: number; emailAddress: string }];
  primaryEmailAddressId?: number;
}

export interface CartLineItem {
  id: number;
  name: string;
  images?:
    | {
        id: string;
        name: string;
        url: string;
      }[]
    | null;
  category: string;
  subcategory?: string | null;
  price: string;
  inventory: number;
  quantity: number;
  storeId: number;
  storeName?: string | null;
  storeStripeAccountId?: string | null;
}

export interface Product {
  id: number;
  name: string;
  images?:
    | {
        id: string;
        name: string;
        url: string;
      }[]
    | null;
  category: string;
  subcategory?: string | null;
  price: string;
  inventory: number;
  quantity: number;
  storeId: number;
  storeName?: string | null;
  storeStripeAccountId?: string | null;
}
