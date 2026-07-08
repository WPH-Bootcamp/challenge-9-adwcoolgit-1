import { z } from 'zod';

import { phoneSchema } from '@/lib/validations/common';

export const paymentMethodOptions = [
  'Bank Negara Indonesia',
  'Bank Rakyat Indonesia',
  'Bank Central Asia',
  'Mandiri',
] as const;

const optionalPhoneSchema = z
  .string()
  .trim()
  .superRefine((value, context) => {
    if (value.length > 0) {
      const result = phoneSchema.safeParse(value);

      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            result.error.issues[0]?.message ??
            'Phone number must be at least 8 characters.',
        });
      }
    }
  });

export const checkoutFormSchema = z.object({
  deliveryAddress: z
    .string()
    .trim()
    .min(10, 'Delivery address must be at least 10 characters.'),
  phone: optionalPhoneSchema,
  paymentMethod: z.enum(paymentMethodOptions),
  notes: z
    .string()
    .trim()
    .max(300, 'Notes cannot exceed 300 characters.'),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
