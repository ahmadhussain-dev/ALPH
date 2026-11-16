import { z } from "zod";

const objectId = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  "Invalid ID"
);

export const addCartItemSchema = z.object({
  body: z.object({
    productId: objectId,
    variantId: objectId,
    quantity: z.number().int().min(1).max(20).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: objectId,
  }),
  body: z.object({
    quantity: z.number().int().min(1).max(20),
  }),
});

export const cartItemIdSchema = z.object({
  params: z.object({
    itemId: objectId,
  }),
});