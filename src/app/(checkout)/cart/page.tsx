import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { env } from "@/env.mjs";
import { Metadata } from "next";
import { CheckoutCard } from "@/components/checkout/checkout-card";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Cart",
  description: "Checkout with your cart items",
};
export default async function CartPage() {
  return (
    <Shell>
      <PageHeader
        id="cart-page-header"
        aria-labelledby="cart-page-header-heading"
      >
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Checkout with your cart items
        </PageHeaderDescription>
      </PageHeader>
      <CheckoutCard />
    </Shell>
  );
}
