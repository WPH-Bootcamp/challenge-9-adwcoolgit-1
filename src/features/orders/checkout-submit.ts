import type { CheckoutPayload } from '@/types/api';
import type { BasketGroup } from '@/types/domain';
import type { CheckoutFormValues } from '@/lib/validations/checkout';

export function buildCheckoutPayload(
  groups: BasketGroup[],
  values: CheckoutFormValues
): CheckoutPayload {
  return {
    restaurants: groups.map((group) => ({
      restaurantId: group.restaurantId,
      items: group.items.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
      })),
    })),
    deliveryAddress: values.deliveryAddress.trim(),
    phone: values.phone.trim() || undefined,
    paymentMethod: values.paymentMethod,
    notes: values.notes?.trim() || undefined,
  };
}

