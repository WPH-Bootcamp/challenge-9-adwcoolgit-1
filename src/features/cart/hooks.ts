'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '@/lib/api/cart';
import { queryKeys } from '@/lib/query/query-keys';
import { cartQuantityChangeSchema } from '@/lib/validations/cart';
import { useAuthStore } from '@/store/auth-store';
import { toBasketGroup } from '@/types/domain';
import type { ApiId } from '@/types/api';

interface CartQuantityUpdateInput {
  cartItemId: ApiId;
  targetQuantity: number;
}

export function useCartQuery() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: getCart,
    enabled: isAuthenticated,
    select: (data) => ({
      groups: data.cart.map(toBasketGroup),
      summary: data.summary,
    }),
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartItemId, targetQuantity }: CartQuantityUpdateInput) => {
      const { quantity } = cartQuantityChangeSchema.parse({
        quantity: targetQuantity,
      });

      if (quantity <= 0) {
        await removeCartItem(cartItemId);
        return null;
      }

      return updateCartItem(cartItemId, { quantity });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: ApiId) => removeCartItem(cartItemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

