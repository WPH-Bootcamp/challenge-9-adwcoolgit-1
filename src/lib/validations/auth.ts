import { z } from "zod";

const authPasswordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(64, "Password must be 64 characters or fewer.");

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim(),
  password: authPasswordSchema,
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(80, "Name must be 80 characters or fewer."),
    email: z.email("Enter a valid email address.").trim(),
    phone: z
      .string()
      .trim()
      .min(8, "Phone number must be at least 8 characters.")
      .max(20, "Phone number must be 20 characters or fewer."),
    password: authPasswordSchema,
    confirmPassword: authPasswordSchema,
    rememberMe: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password must match password.",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
