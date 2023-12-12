import * as z from "zod";
import { cartLineItemSchema } from "./cart";

// export const getStripeAccountSchema = z.object({
//   retrieveAccount: z.boolean().default(true).optional(),
// });

export const createPaymentIntentSchema = z.object({
  items: z.array(cartLineItemSchema),
});

export const getPaymentIntentSchema = z.object({
  paymentIntentId: z.string(),
  deliveryPostalCode: z.string().optional().nullable(),
});
