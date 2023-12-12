import { CartLineItem } from "@/types";

export function calculateOrderAmount(items: CartLineItem[]) {
  const total = items.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);
  const fee = total * 0.01;
  return {
    total: Number((total * 100).toFixed(0)), // converts to cents which stripe charges in
    fee: Number((fee * 100).toFixed(0)),
  };
}
