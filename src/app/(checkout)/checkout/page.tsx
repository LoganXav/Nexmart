import { env } from "@/env.mjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
};

export default async function CheckoutPage() {
  notFound();

  return <div>hi</div>;
}
