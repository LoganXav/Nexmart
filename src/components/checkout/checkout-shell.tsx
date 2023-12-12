"use client";

import * as React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";

import { getStripe } from "@/lib/get-stripe";
import { cn } from "@/lib/utils";

// Docs: https://stripe.com/docs/payments/quickstart

interface CheckoutShellProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  paymentIntent: Promise<{
    clientSecret: string | null;
  }>;
}

export function CheckoutShell({
  children,
  paymentIntent,
  className,
  ...props
}: CheckoutShellProps) {
  const stripePromise = React.useMemo(() => getStripe(), []);

  // Calling createPaymentIntentAction at the client component to avoid stripe authentication error in server action
  const { clientSecret } = React.use(paymentIntent);

  if (!clientSecret) {
    return (
      <section className={cn("h-full w-full", className)} {...props}>
        <div className="flex items-center justify-center h-full w-full bg-white" />
        <h1>no client secret</h1>
      </section>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "flat",
    },
  };

  return (
    <section className={cn("h-full w-full", className)} {...props}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </section>
  );
}
