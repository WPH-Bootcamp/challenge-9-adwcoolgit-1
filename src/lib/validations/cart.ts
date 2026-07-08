import { z } from 'zod';

export const cartQuantityChangeSchema = z.object({
  quantity: z.coerce
    .number()
    .int()
    .min(0, 'Quantity cannot be negative.')
    .max(99, 'Quantity cannot exceed 99 items.'),
});

export type CartQuantityChangeInput = z.infer<typeof cartQuantityChangeSchema>;

