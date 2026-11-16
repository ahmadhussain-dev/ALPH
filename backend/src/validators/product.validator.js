
import { z } from "zod";

const variantSchema = z.object({
  size: z.string().trim().min(1).max(20),
  color: z.string().trim().min(1).max(40),
  sku: z.string().trim().min(2).max(50),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
}).strict();

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(150),

    slug: z.string()
      .trim()
      .min(2)
      .max(180)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

    description: z.string().trim().min(5).max(5000),

    category: z.string().regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid category ID"
    ),

    images: z.array(
      z.object({
        url: z.string().url(),
        alt: z.string().max(200).optional(),
      }).strict()
    ).min(1).max(10),

    variants: z.array(variantSchema).min(1),

    tags: z.array(z.string().trim().min(1).max(30))
      .max(20).optional(),

    isFeatured: z.boolean().optional(),
  }).strict(),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),

  body: z.object({
    name: z.string().trim().min(2).max(150).optional(),

    slug: z.string()
      .trim()
      .min(2)
      .max(180)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),

    description: z.string().trim().min(5).max(5000).optional(),

    category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),

    images: z.array(
      z.object({
        url: z.string().url(),
        alt: z.string().max(200).optional(),
      }).strict()
    ).min(1).max(10).optional(),

    variants: z.array(variantSchema).min(1).optional(),

    tags: z.array(z.string().trim().min(1).max(30))
      .max(20).optional(),

    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }).strict().refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update"
  ),
});

export const productQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),

    search: z.string().trim().max(100).optional(),

    category: z.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),

    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),

    sort: z.enum([
      "newest",
      "price-asc",
      "price-desc",
    ]).default("newest"),
  }).strict().refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "Minimum price cannot exceed maximum price",
      path: ["minPrice"],
    }
  ),
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(2).max(180),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
});