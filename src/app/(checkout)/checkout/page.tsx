import { getCartAction } from "@/app/_actions/cart";
import { createPaymentIntentAction } from "@/app/_actions/stripe";
import { env } from "@/env.mjs";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CartLineItems } from "@/components/checkout/cart-line-items";
import { formatPrice } from "@/lib/utils";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
};

export default async function CheckoutPage() {
  // notFound();
  const cartLineItems = await getCartAction();

  // FIX -- until i correct the products in my db to have the valid image schema

  const productsWithoutImages = cartLineItems.map((item) => {
    const { images, ...itemWithoutImages } = item;
    return itemWithoutImages;
  });
  const paymentIntent = createPaymentIntentAction({
    items: productsWithoutImages,
  });

  const total = cartLineItems.reduce(
    (total, item) => total + item.quantity * Number(item.price),
    0
  );

  return (
    <section className="relative flex h-full min-h-[100dvh] flex-col items-start justify-center lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <div className="w-full space-y-12 pt-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-[#09090b] py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center justify-between space-x-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2 lg:flex-auto"
            >
              <ArrowLeftIcon
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                Nexmart
              </div>
              <div className="hidden font-medium transition group-hover:block">
                Back
              </div>
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </DrawerTrigger>
              <DrawerContent className="flex h-[80%] flex-col space-y-5 bg-zinc-50 py-8 text-zinc-950">
                <CartLineItems
                  items={cartLineItems}
                  variant="minimal"
                  isEditable={false}
                  className="container max-w-6xl"
                />
                <div className="container flex max-w-6xl pr-6 font-medium">
                  <div className="flex-1">
                    Total (
                    {cartLineItems.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    )}
                    )
                  </div>
                  <div>{formatPrice(total)}</div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="container flex max-w-xl flex-col items-center space-y-1 lg:ml-auto lg:mr-0 lg:items-start lg:pr-[4.5rem]">
          <div className="line-clamp-1 font-semibold text-muted-foreground">
            Pay
          </div>
          <div className="text-3xl font-bold">{formatPrice(total)}</div>
        </div>
        <CartLineItems
          items={cartLineItems}
          isEditable={false}
          className="container hidden w-full max-w-xl lg:ml-auto lg:mr-0 lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
      </div>
      <CheckoutShell
        paymentIntent={paymentIntent}
        className="h-full w-full flex-1 bg-white pb-12 pt-10 lg:flex-initial lg:pl-12 lg:pt-16"
      >
        <ScrollArea className="h-full">
          <CheckoutForm className="container max-w-xl pr-6 lg:ml-0 lg:mr-auto" />
        </ScrollArea>
      </CheckoutShell>
    </section>
  );
}
