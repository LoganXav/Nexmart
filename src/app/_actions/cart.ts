"use server";

import { db } from "@/db";
import { carts, products } from "@/db/schema";
import { cartItemSchema, deleteCartItemSchema } from "@/lib/validations/cart";
import type { CartLineItem } from "@/types";
import { asc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { type z } from "zod";

export async function getCartAction(): Promise<CartLineItem[]> {
  // IDENTIFIES THE USER'S SHOPPING CART FROM THE COOKIE STORE
  const cartId = cookies().get("cartId")?.value;

  if (!cartId || isNaN(Number(cartId))) return [];

  // RETRIEVES THE CART INFORMATION BY INSPECTING THE ITEMS COLUMN BASED ON THE CARTID
  const cart = await db.query.carts.findFirst({
    columns: {
      items: true,
    },
    where: eq(carts.id, Number(cartId)),
  });

  const productIds = cart?.items?.map((item) => item.productId) ?? [];

  if (productIds.length === 0) return [];

  // DEDUPLICATES THE PRODUCT IDS
  const uniqueProductIds = [...new Set(productIds)];

  // RETRIEVES THE PRODUCT INFORMATION FOR THE UNIQUE PRODUCT IDS FROM THE DB
  const cartLineItems = await db
    .select()
    .from(products)
    .where(inArray(products.id, uniqueProductIds))
    .groupBy(products.id)
    .orderBy(asc(products.createdAt))
    .execute()
    .then((items) => {
      return items.map((item) => {
        const quantity = cart?.items?.find(
          (cartItem) => cartItem.productId === item.id
        )?.quantity;

        return {
          ...item,
          quantity: quantity ?? 0,
        };
      });
    });

  return cartLineItems;
}

export async function addToCartAction(
  rawInput: z.infer<typeof cartItemSchema>
) {
  // VALIDATIONG THE INPUT FROM THE ADD ACTION
  const input = cartItemSchema.parse(rawInput);

  // CHECKING IF THE INPUT IS IN STOCK BY CHECKING THE INVENTORY COLUMN OF THE PRODUCTS
  const product = await db.query.products.findFirst({
    columns: {
      inventory: true,
    },
    where: eq(products.id, input.productId),
  });

  if (!product) {
    throw new Error("Product not found, please try again.");
  }
  if (product.inventory < input.quantity) {
    throw new Error("Product is out of stock, please try again later.");
  }

  // RETRIEVE A SHOPPING CART ID STORED IN THE USER'S COOKIES AND IF NOT PRESENT, ADD TO CARTS TABLE AND STORE IN USER'S COOKIES FOR FUTURE REFERENCE
  const cookieStore = cookies();

  const cartId = cookieStore.get("cartId")?.value;
  if (!cartId) {
    const cart = await db.insert(carts).values({
      items: [input],
    });

    cookieStore.set("cartId", String(cart.insertId));

    revalidatePath("/");
    return;
  }
  // SEARCH FOR THE RETRIEVED CART FORM THE DB, IF NOT SET EXPIRY CONDITIONS
  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  });

  // TODO: Find a better way to deal with expired carts
  if (!cart) {
    cookieStore.set({
      name: "cartId",
      value: "",
      expires: new Date(0),
    });

    await db.delete(carts).where(eq(carts.id, Number(cartId)));

    throw new Error("Cart not found, please try again.");
  }

  // IF CART IS CLOSED, DEELETE IT AND CREATE A NEW ONE
  if (cart.closed) {
    await db.delete(carts).where(eq(carts.id, Number(cartId)));

    const newCart = await db.insert(carts).values({
      items: [input],
    });

    cookieStore.set("cartId", String(newCart.insertId));

    revalidatePath("/");
    return;
  }
  // CHECK IF THE PRODUCT ADDED TO CART IS IN THE CART
  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  );

  if (cartItem) {
    cartItem.quantity = cartItem.quantity += input.quantity;
  } else {
    cart.items?.push(input);
  }

  // UPDATE NEW CART DATA IN DB
  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
}

export async function updateCartItemAction(
  rawInput: z.infer<typeof cartItemSchema>
) {
  const input = cartItemSchema.parse(rawInput);

  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    throw new Error("cartId not found, please try again.");
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.");
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  });

  if (!cart) {
    throw new Error("Cart not found, please try again.");
  }

  const cartItem = cart.items?.find(
    (item) => item.productId === input.productId
  );
  if (!cartItem) {
    throw new Error("CartItem not found, please try again.");
  }

  if (input.quantity === 0) {
    cart.items =
      cart.items?.filter((item) => item.productId !== input.productId) ?? [];
  } else {
    cartItem.quantity = input.quantity;
  }

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
}

export async function deleteCartItemAction(
  rawInput: z.infer<typeof deleteCartItemSchema>
) {
  const input = deleteCartItemSchema.parse(rawInput);

  const cartId = cookies().get("cartId")?.value;

  if (!cartId) {
    throw new Error("cartId not found, please try again.");
  }

  if (isNaN(Number(cartId))) {
    throw new Error("Invalid cartId, please try again.");
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, Number(cartId)),
  });

  if (!cart) return;

  cart.items =
    cart.items?.filter((item) => item.productId !== input.productId) ?? [];

  await db
    .update(carts)
    .set({
      items: cart.items,
    })
    .where(eq(carts.id, Number(cartId)));

  revalidatePath("/");
}
