import { z } from "zod";

export const idSchema = z.union([z.string(), z.number()]);

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().catch(10),
});

export const phoneSchema = z
  .string()
  .trim()
  .min(8, "Phone number must be at least 8 characters.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

export const nonEmptyTextSchema = z
  .string()
  .trim()
  .min(1, "This field is required.");
