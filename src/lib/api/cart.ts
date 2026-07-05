import { apiClient, unwrapResponse } from "@/lib/api/axios";
import type {
  AddToCartPayload,
  ApiSuccessResponse,
  CartDataPayload,
  CartGroupPayload,
  CartItemPayload,
  CartResponse,
  UpdateCartItemPayload,
} from "@/types/api";

type CartItemMutationResponse = ApiSuccessResponse<{ cartItem: CartItemPayload }>;

export async function getCart(): Promise<CartDataPayload> {
  const response = await apiClient.get<CartResponse>("/api/cart");
  return unwrapResponse(response);
}

export async function addToCart(payload: AddToCartPayload): Promise<CartItemPayload> {
  const response = await apiClient.post<CartItemMutationResponse>("/api/cart", payload);
  return unwrapResponse(response).cartItem;
}

export async function updateCartItem(
  cartItemId: string | number,
  payload: UpdateCartItemPayload,
): Promise<CartItemPayload> {
  const response = await apiClient.put<CartItemMutationResponse>(`/api/cart/${cartItemId}`, payload);
  return unwrapResponse(response).cartItem;
}

export async function removeCartItem(cartItemId: string | number): Promise<void> {
  await apiClient.delete(`/api/cart/${cartItemId}`);
}

export async function clearCart(): Promise<void> {
  await apiClient.delete("/api/cart");
}

export function findCartGroupByRestaurant(
  cart: CartGroupPayload[],
  restaurantId: string | number,
): CartGroupPayload | undefined {
  return cart.find((group) => String(group.restaurant.id) === String(restaurantId));
}
