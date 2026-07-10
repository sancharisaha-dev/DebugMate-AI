import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be at most 100 characters");

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be at most 80 characters"),
    email: z
      .string()
      .trim()
      .email("Email must be valid")
      .toLowerCase(),
    password: passwordSchema
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Email must be valid")
      .toLowerCase(),
    password: z.string().min(1, "Password is required")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
