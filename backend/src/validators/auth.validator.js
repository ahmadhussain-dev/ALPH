
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(80),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must not exceed 72 characters"),
  }).strict(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email()
      .toLowerCase(),

    password: z
      .string()
      .min(1, "Password is required")
      .max(72),
  }).strict(),
});
