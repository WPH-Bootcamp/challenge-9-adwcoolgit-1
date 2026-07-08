'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clearCart } from '@/lib/api/cart';
import { checkout, getMyOrders, type OrderHistoryParams } from '@/lib/api/orders';
import { createReview } from '@/lib/api/reviews';
import { queryKeys } from '@/lib/query/query-keys';
import type { CheckoutFormValues } from '@/lib/validations/checkout';
import { useAuthStore } from '@/store/auth-store';
import { toOrderRecord } from '@/types/domain';
import type { BasketGroup, OrderRecord } from '@/types/domain';
import type { CreateReviewPayload } from '@/types/api';

import { buildCheckoutPayload } from './checkout-submit';

interface CheckoutMutationInput {
  groups: BasketGroup[];
  values: CheckoutFormValues;
}

export type OrderHistoryFilter = 'all' | 'preparing' | 'on_the_way' | 'delivered' | 'done' | 'cancelled';

export const orderHistoryFilters: Array<{
  value: OrderHistoryFilter;
  label: string;
}> = [
  { value: 'preparing', label: 'Preparing' },
  { value: 'on_the_way', label: 'On the Way' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Canceled' },
];

export function normalizeOrderHistoryFilter(value: string | null | undefined): OrderHistoryFilter {
  if (
    value === 'preparing' ||
    value === 'on_the_way' ||
    value === 'delivered' ||
    value === 'done' ||
    value === 'cancelled'
  ) {
    return value;
  }

  return 'all';
}

export function toOrderHistoryParams(filter: OrderHistoryFilter): OrderHistoryParams | undefined {
  if (filter === 'all') {
    return undefined;
  }

  return {
    status: filter,
    page: 1,
    limit: 20,
  };
}

function toOrderHistoryQueryKeyParams(params?: OrderHistoryParams) {
  if (!params) {
    return { status: 'all' as const };
  }

  return {
    status: params.status,
    page: params.page,
    limit: params.limit,
  };
}

export function filterOrdersBySearchQuery(orders: OrderRecord[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return orders;
  }

  return orders.filter((order) => {
    const haystack = [
      order.transactionId,
      order.status,
      ...order.restaurants.map((restaurant) => restaurant.restaurantName),
      ...order.restaurants.flatMap((restaurant) => restaurant.items.map((item) => item.name)),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function useCheckoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groups, values }: CheckoutMutationInput) => {
      const order = await checkout(buildCheckoutPayload(groups, values));
      return toOrderRecord(order);
    },
    onSuccess: async () => {
      await clearCart().catch(() => undefined);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
      ]);
    },
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: async (_review, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.restaurants.detail(payload.restaurantId) }),
      ]);
    },
  });
}

export function useOrderHistory(filter: OrderHistoryFilter, searchQuery: string) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryParams = toOrderHistoryParams(filter);

  const query = useQuery({
    queryKey: queryKeys.orders.list(toOrderHistoryQueryKeyParams(queryParams)),
    queryFn: () => getMyOrders(queryParams),
    enabled: isAuthenticated,
    select: (data) => ({
      ...data,
      orders: data.orders.map(toOrderRecord),
    }),
  });

  const filteredOrders = filterOrdersBySearchQuery(query.data?.orders ?? [], searchQuery);

  return {
    ...query,
    filteredOrders,
  };
}
