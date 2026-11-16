
import { z } from "zod";

const categoryFields = {
  name: z.string().trim().min(2).max(80),
  slug: z.string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional(),
  image: z.string().url().or(z.literal("")).optional(),
};

export const createCategorySchema = z.object({
  body: z.object(categoryFields).strict(),
});

export const categoryListSchema = z.object({
  query: z.object({
    // Public requests only show active categories.
  }).strict(),
});
