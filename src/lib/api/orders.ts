import { apiClient, toApiParams, unwrapResponse } from "@/lib/api/axios";
import type {
  CheckoutPayload,
  CheckoutResponse,
  OrderHistoryResponse,
  OrderPayload,
  OrdersDataPayload,
  OrderStatus,
} from "@/types/api";

export interface OrderHistoryParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export async function checkout(payload: CheckoutPayload): Promise<OrderPayload> {
  const response = await apiClient.post<CheckoutResponse>("/api/order/checkout", payload);
  return unwrapResponse(response).transaction;
}

export async function getMyOrders(params?: OrderHistoryParams): Promise<OrdersDataPayload> {
  const response = await apiClient.get<OrderHistoryResponse>("/api/order/my-order", {
    params: toApiParams(params),
  });

  return unwrapResponse(response);
}
