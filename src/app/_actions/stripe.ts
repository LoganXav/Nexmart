"use server";

import { calculateOrderAmount } from "@/lib/checkout";
import {
  createPaymentIntentSchema,
  getPaymentIntentSchema,
} from "@/lib/validations/stripe";
import { CheckoutItem } from "@/types";
import { cookies } from "next/headers";
import { type z } from "zod";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { carts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createPaymentIntentAction(
  rawInput: z.infer<typeof createPaymentIntentSchema>
): Promise<{ clientSecret: string | null }> {
  try {
    const input = createPaymentIntentSchema.parse(rawInput);

    const cartId = Number(cookies().get("cartId")?.value);

    const checkoutItems: CheckoutItem[] = input.items.map((item) => ({
      productId: item.id,
      price: Number(item.price),
      quantity: item.quantity,
    }));

    const metadata = {
      cartId: isNaN(cartId) ? "" : cartId,
      items: JSON.stringify(checkoutItems),
    };

    const { total, fee } = calculateOrderAmount(input.items);

    // Create a payment intent if it doesn't exist
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update the cart with the payment intent id and client secret
    if (paymentIntent.status === "requires_payment_method") {
      await db
        .update(carts)
        .set({
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        })
        .where(eq(carts.id, cartId));
    }
    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (err) {
    console.error(err);
    return {
      clientSecret: null,
    };
  }
}

export async function getPaymentIntentAction(
  rawInput: z.infer<typeof getPaymentIntentSchema>
) {
  try {
    const input = getPaymentIntentSchema.parse(rawInput);

    const cartId = cookies().get("cartId")?.value;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      input.paymentIntentId
    );

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment intent not succeeded");
    }

    if (
      paymentIntent.metadata.cartId !== cartId &&
      paymentIntent.shipping?.address?.postal_code?.split(" ").join("") !==
        input.deliveryPostalCode
    ) {
      throw new Error("CartId or delivery postal code does not match.");
    }
    return {
      paymentIntent,
      isVerified: true,
    };
  } catch (err) {
    console.error(err);
    return {
      paymentIntent: null,
      isVerified: false,
    };
  }
}
