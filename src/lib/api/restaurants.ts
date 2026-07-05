import { apiClient, toApiParams, unwrapResponse } from "@/lib/api/axios";
import type {
  ApiPaginationMeta,
  ApiSuccessResponse,
  RestaurantDetailPayload,
  RestaurantDetailResponse,
  RestaurantListDataPayload,
  RestaurantListItemPayload,
  RestaurantListResponse,
} from "@/types/api";

export interface RestaurantListParams {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}

export interface RestaurantSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface RestaurantDetailParams {
  limitMenu?: number;
  limitReview?: number;
}

export interface NearbyRestaurantParams {
  range?: number;
  limit?: number;
}

export interface PagedRestaurantResponse extends RestaurantListDataPayload {
  searchQuery?: string;
}

export interface RecommendedRestaurantPayload extends RestaurantListItemPayload {
  lat?: number | null;
  long?: number | null;
  sampleMenus?: Array<{
    id: string | number;
    foodName: string;
    price: number;
    type?: string | null;
    image?: string | null;
  }>;
  isFrequentlyOrdered?: boolean;
}

type RestaurantSearchResponse = ApiSuccessResponse<PagedRestaurantResponse>;
type NearbyRestaurantResponse = ApiSuccessResponse<{ restaurants: RestaurantListItemPayload[] }>;
type RecommendedRestaurantResponse = ApiSuccessResponse<{
  recommendations: RecommendedRestaurantPayload[];
  message?: string;
}>;

function createFallbackPagination(items: RestaurantListItemPayload[]): ApiPaginationMeta {
  return {
    page: 1,
    limit: items.length,
    total: items.length,
    totalPages: items.length > 0 ? 1 : 0,
  };
}

export async function getRestaurants(
  params?: RestaurantListParams,
): Promise<RestaurantListDataPayload> {
  const response = await apiClient.get<RestaurantListResponse>("/api/resto", {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}

export async function searchRestaurants(
  params: RestaurantSearchParams,
): Promise<PagedRestaurantResponse> {
  const response = await apiClient.get<RestaurantSearchResponse>("/api/resto/search", {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}

export async function getRestaurantDetail(
  restaurantId: string | number,
  params?: RestaurantDetailParams,
): Promise<RestaurantDetailPayload> {
  const response = await apiClient.get<RestaurantDetailResponse>(`/api/resto/${restaurantId}`, {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}

export async function getBestSellerRestaurants(
  params?: Pick<RestaurantListParams, "page" | "limit">,
): Promise<RestaurantListDataPayload> {
  const response = await apiClient.get<RestaurantListResponse>("/api/resto/best-seller", {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}

export async function getNearbyRestaurants(
  params?: NearbyRestaurantParams,
): Promise<RestaurantListDataPayload> {
  const response = await apiClient.get<NearbyRestaurantResponse>("/api/resto/nearby", {
    params: toApiParams(params),
  });
  const data = unwrapResponse(response);

  return {
    restaurants: data.restaurants,
    pagination: createFallbackPagination(data.restaurants),
  };
}

export async function getRecommendedRestaurants(): Promise<RecommendedRestaurantPayload[]> {
  const response = await apiClient.get<RecommendedRestaurantResponse>("/api/resto/recommended");
  const data = unwrapResponse(response);

  return data.recommendations;
}
