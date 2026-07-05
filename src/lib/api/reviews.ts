import { apiClient, toApiParams, unwrapResponse } from "@/lib/api/axios";
import type {
  ApiSuccessResponse,
  CreateReviewPayload,
  RestaurantReviewPayload,
  ReviewListDataPayload,
  ReviewListResponse,
  UpdateReviewPayload,
} from "@/types/api";

export interface ReviewListParams {
  page?: number;
  limit?: number;
}

type ReviewMutationResponse = ApiSuccessResponse<{ review: RestaurantReviewPayload }>;

export async function createReview(payload: CreateReviewPayload): Promise<RestaurantReviewPayload> {
  const response = await apiClient.post<ReviewMutationResponse>("/api/review", payload);
  return unwrapResponse(response).review;
}

export async function getMyReviews(params?: ReviewListParams): Promise<ReviewListDataPayload> {
  const response = await apiClient.get<ReviewListResponse>("/api/review/my-reviews", {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}

export async function getRestaurantReviews(
  restaurantId: string | number,
  params?: ReviewListParams,
): Promise<ReviewListDataPayload> {
  const response = await apiClient.get<ReviewListResponse>(`/api/review/restaurant/${restaurantId}`, {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}

export async function updateReview(
  reviewId: string | number,
  payload: UpdateReviewPayload,
): Promise<RestaurantReviewPayload> {
  const response = await apiClient.put<ReviewMutationResponse>(`/api/review/${reviewId}`, payload);
  return unwrapResponse(response).review;
}

export async function deleteReview(reviewId: string | number): Promise<void> {
  await apiClient.delete(`/api/review/${reviewId}`);
}
