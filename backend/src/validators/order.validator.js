
import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().min(10).max(20),
  city: z.string().trim().min(2).max(80),
  addressLine: z.string().trim().min(8).max(300),
  postalCode: z.string().trim().max(15).optional().default(""),
});

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.literal("cash_on_delivery").default("cash_on_delivery"),
  }),
});

export const orderIdSchema = z.object({
  params: z.object({
    orderId: objectId,
  }),
});

export const adminOrderListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z.enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ]).optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: objectId,
  }),
  body: z.object({
    status: z.enum([
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ]),
  }),
});
