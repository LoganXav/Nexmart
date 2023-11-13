import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartLineItems } from "@/components/checkout/cart-line-items";
import { getCartAction } from "@/app/_actions/cart";
import { Icons } from "../icons";

export async function CheckoutCard() {
  const cartLineItems = await getCartAction();

  return (
    <>
      {cartLineItems.length > 0 ? (
        <Card
          as="section"
          id={`checkout-card`}
          aria-labelledby={`checkout-card-heading`}
          className={cn("border-green-500")}
        >
          <CardHeader className="flex flex-row items-center space-x-4 py-4">
            <CardTitle className="line-clamp-1 flex-1">
              Cart (
              {cartLineItems.reduce((acc, item) => acc + item.quantity, 0)})
            </CardTitle>
            <Link
              aria-label="Checkout"
              href={`/checkout`}
              className={cn(
                buttonVariants({
                  size: "sm",
                })
              )}
            >
              Checkout
            </Link>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="pb-6 pl-6 pr-0">
            <CartLineItems items={cartLineItems} className="max-h-[280px]" />
          </CardContent>
          <Separator className="mb-4" />
          <CardFooter className="space-x-4">
            <span className="flex-1">Total Price</span>
            <span>
              {formatPrice(
                cartLineItems.reduce(
                  (acc, item) => acc + Number(item.price) * item.quantity,
                  0
                )
              )}
            </span>
          </CardFooter>
        </Card>
      ) : (
        <section
          id="cart-page-empty-cart"
          aria-labelledby="cart-page-empty-cart-heading"
          className="flex h-full flex-col items-center justify-center space-y-1 pt-16"
        >
          <Icons.cart
            className="mb-4 h-16 w-16 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="text-xl font-medium text-muted-foreground">
            Your cart is empty
          </div>
          <Link
            aria-label="Add items to your cart to checkout"
            href="/products"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "sm",
                className: "text-sm text-muted-foreground",
              })
            )}
          >
            Add items to your cart to checkout
          </Link>
        </section>
      )}
    </>
  );
}
