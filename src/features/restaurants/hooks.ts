"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getBestSellerRestaurants,
  getNearbyRestaurants,
  getRecommendedRestaurants,
  getRestaurants,
} from "@/lib/api/restaurants";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { toRestaurantCard, type RestaurantCard } from "@/types/domain";

function mapCards(items: Parameters<typeof toRestaurantCard>[0][]) {
  return items.map(toRestaurantCard);
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
  const hasCoordinates = user?.latitude !== null && user?.latitude !== undefined && user?.longitude !== null && user?.longitude !== undefined;

  return useQuery({
    queryKey: queryKeys.restaurants.nearby(),
    queryFn: () => getNearbyRestaurants({ limit }),
    enabled: isAuthenticated && hasCoordinates,
    select: (data) => mapCards(data.restaurants),
  });
}

export interface HomeDiscoverySections {
  spotlight: RestaurantCard[];
  bestSeller: RestaurantCard[];
  recommended: RestaurantCard[];
  nearby: RestaurantCard[];
}
