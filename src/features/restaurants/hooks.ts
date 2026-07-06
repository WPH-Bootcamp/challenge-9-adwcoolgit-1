"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addToCart,
  findCartGroupByRestaurant,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import {
  getBestSellerRestaurants,
  getNearbyRestaurants,
  getRecommendedRestaurants,
  getRestaurantDetail,
  getRestaurants,
  searchRestaurants,
} from "@/lib/api/restaurants";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth-store";
import type { ApiId, ApiPaginationMeta, CartGroupPayload } from "@/types/api";
import {
  toRestaurantCard,
  toRestaurantDetail,
  type DiscoveryState,
  type RestaurantCard,
} from "@/types/domain";

import {
  filterRestaurantsByDiscoveryState,
  getDiscoveryLimit,
  getDiscoveryPage,
  hasSupplementalDiscoveryFilters,
  toRestaurantListParams,
  toRestaurantSearchParams,
} from "./discovery-state";

function mapCards(items: Parameters<typeof toRestaurantCard>[0][]) {
  return items.map(toRestaurantCard);
}

function buildLocalPagination(total: number, page: number, limit: number): ApiPaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: total > 0 ? Math.ceil(total / limit) : 0,
  };
}

function mapCartSelection(cart: CartGroupPayload[], restaurantId: string | number) {
  const group = findCartGroupByRestaurant(cart, restaurantId);
  const itemsByMenuId = Object.fromEntries(
    (group?.items ?? []).map((item) => [
      String(item.menu.id),
      {
        cartItemId: item.id,
        quantity: item.quantity,
      },
    ]),
  );

  return {
    itemsByMenuId,
    totalItems: cart.reduce(
      (groupSum, restaurantGroup) =>
        groupSum + restaurantGroup.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    ),
  };
}

export function useRestaurantFeed(limit = 8) {
  return useQuery({
    queryKey: queryKeys.restaurants.list({ page: 1, limit }),
    queryFn: () => getRestaurants({ page: 1, limit }),
    select: (data) => ({
      ...data,
      restaurants: mapCards(data.restaurants),
    }),
  });
}

export function useDiscoveryRestaurantFeed(state: DiscoveryState) {
  const hasSearchQuery = state.q.trim().length > 0;
  const hasSupplementalFilters = hasSupplementalDiscoveryFilters(state);
  const page = getDiscoveryPage(state);
  const limit = getDiscoveryLimit(state);

  return useQuery({
    queryKey: queryKeys.restaurants.list({
      mode: hasSearchQuery ? "search" : "browse",
      ...state,
    }),
    queryFn: async () => {
      if (hasSearchQuery) {
        return searchRestaurants(
          toRestaurantSearchParams(state, hasSupplementalFilters ? 100 : undefined),
        );
      }

      return getRestaurants(toRestaurantListParams(state));
    },
    select: (data) => {
      const restaurants = mapCards(data.restaurants);

      if (hasSearchQuery && hasSupplementalFilters) {
        const filteredRestaurants = filterRestaurantsByDiscoveryState(restaurants, state);
        const startIndex = (page - 1) * limit;
        const searchData = data as { searchQuery?: string };

        return {
          restaurants: filteredRestaurants.slice(startIndex, startIndex + limit),
          pagination: buildLocalPagination(filteredRestaurants.length, page, limit),
          searchQuery: searchData.searchQuery ?? state.q.trim(),
        };
      }

      return {
        ...data,
        restaurants,
      };
    },
  });
}

export function useBestSellerFeed(limit = 4) {
  return useQuery({
    queryKey: queryKeys.restaurants.bestSeller(),
    queryFn: () => getBestSellerRestaurants({ page: 1, limit }),
    select: (data) => ({
      ...data,
      restaurants: mapCards(data.restaurants),
    }),
  });
}

export function useRecommendedFeed() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.restaurants.recommended(),
    queryFn: getRecommendedRestaurants,
    enabled: isAuthenticated,
    select: (data) => mapCards(data),
  });
}

export function useNearbyFeed(limit = 4) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCoordinates =
    user?.latitude !== null &&
    user?.latitude !== undefined &&
    user?.longitude !== null &&
    user?.longitude !== undefined;

  return useQuery({
    queryKey: queryKeys.restaurants.nearby(),
    queryFn: () => getNearbyRestaurants({ limit }),
    enabled: isAuthenticated && hasCoordinates,
    select: (data) => mapCards(data.restaurants),
  });
}

export function useRestaurantDetail(restaurantId: string | number) {
  return useQuery({
    queryKey: [...queryKeys.restaurants.detail(restaurantId), { limitMenu: 24, limitReview: 24 }],
    queryFn: () => getRestaurantDetail(restaurantId, { limitMenu: 24, limitReview: 24 }),
    enabled: Boolean(restaurantId),
    select: toRestaurantDetail,
  });
}

export function useRestaurantCartSelection(restaurantId: string | number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: [...queryKeys.cart.current(), "restaurant", restaurantId],
    queryFn: getCart,
    enabled: isAuthenticated,
    select: (data) => mapCartSelection(data.cart, restaurantId),
  });
}

interface SetRestaurantMenuQuantityInput {
  restaurantId: ApiId;
  menuId: ApiId;
  targetQuantity: number;
  cartItemId?: ApiId;
}

export function useSetRestaurantMenuQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ restaurantId, menuId, targetQuantity, cartItemId }: SetRestaurantMenuQuantityInput) => {
      if (targetQuantity <= 0) {
        if (cartItemId !== undefined) {
          await removeCartItem(cartItemId);
        }

        return null;
      }

      if (cartItemId !== undefined) {
        return updateCartItem(cartItemId, { quantity: targetQuantity });
      }

      return addToCart({
        restaurantId,
        menuId,
        quantity: targetQuantity,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

export interface HomeDiscoverySections {
  spotlight: RestaurantCard[];
  bestSeller: RestaurantCard[];
  recommended: RestaurantCard[];
  nearby: RestaurantCard[];
}
