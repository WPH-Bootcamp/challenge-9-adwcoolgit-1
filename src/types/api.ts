export type ApiId = string | number;

export type MenuType = "food" | "drink";

export type OrderStatus = "preparing" | "on_the_way" | "delivered" | "done" | "cancelled";

export interface ApiPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: string[];
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
  phone: string;
}

export interface AuthTokenPayload {
  token: string;
}

export interface UserProfilePayload {
  id: ApiId;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string | null;
}

export interface AuthResponsePayload extends AuthTokenPayload {
  user: UserProfilePayload;
}

export interface RestaurantPriceRangePayload {
  min: number;
  max: number;
}

export interface RestaurantCoordinatesPayload {
  lat: number;
  long: number;
}

export interface RestaurantListItemPayload {
  id: ApiId;
  name: string;
  star?: number | null;
  place?: string | null;
  logo?: string | null;
  images?: string[];
  category?: string | null;
  reviewCount?: number;
  menuCount?: number;
  priceRange?: RestaurantPriceRangePayload | null;
  distance?: number | null;
}

export interface RestaurantListFiltersPayload {
  range?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  rating?: number | null;
  category?: string | null;
}

export interface RestaurantListDataPayload {
  restaurants: RestaurantListItemPayload[];
  pagination: ApiPaginationMeta;
  filters?: RestaurantListFiltersPayload;
}

export interface RestaurantReviewUserPayload {
  id: ApiId;
  name: string;
  avatar?: string | null;
}

export interface RestaurantReviewRestaurantPayload {
  id: ApiId;
  name: string;
  logo?: string | null;
}

export interface ReviewedMenuPayload {
  menuId: ApiId;
  menuName: string;
  price: number;
  type?: MenuType | string | null;
  image?: string | null;
  quantity?: number;
}

export interface RestaurantReviewPayload {
  id: ApiId;
  star: number;
  comment?: string | null;
  transactionId?: string | null;
  createdAt?: string | null;
  user?: RestaurantReviewUserPayload;
  restaurant?: RestaurantReviewRestaurantPayload;
  menus?: ReviewedMenuPayload[];
}

export interface MenuItemPayload {
  id: ApiId;
  foodName?: string;
  food_name?: string;
  price: number;
  type?: MenuType | string | null;
  image?: string | null;
  restoId?: ApiId;
  resto_id?: ApiId;
}

export interface RestaurantDetailPayload extends RestaurantListItemPayload {
  averageRating?: number | null;
  coordinates?: RestaurantCoordinatesPayload | null;
  totalMenus?: number;
  totalReviews?: number;
  menus?: MenuItemPayload[];
  reviews?: RestaurantReviewPayload[];
}

export interface CartRestaurantPayload {
  id: ApiId;
  name: string;
  logo?: string | null;
}

export interface CartMenuPayload {
  id: ApiId;
  foodName: string;
  price: number;
  type?: MenuType | string | null;
  image?: string | null;
}

export interface CartItemPayload {
  id: ApiId;
  quantity: number;
  itemTotal?: number;
  menu: CartMenuPayload;
}

export interface CartGroupPayload {
  restaurant: CartRestaurantPayload;
  items: CartItemPayload[];
  subtotal: number;
}

export interface CartSummaryPayload {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

export interface CartDataPayload {
  cart: CartGroupPayload[];
  summary: CartSummaryPayload;
}

export interface AddToCartPayload {
  restaurantId: ApiId;
  menuId: ApiId;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CheckoutRestaurantItemPayload {
  menuId: ApiId;
  quantity: number;
}

export interface CheckoutRestaurantGroupPayload {
  restaurantId: ApiId;
  items: CheckoutRestaurantItemPayload[];
}

export interface CheckoutPayload {
  restaurants: CheckoutRestaurantGroupPayload[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface OrderPricingPayload {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface OrderRestaurantItemPayload {
  menuId: ApiId;
  menuName: string;
  price: number;
  image?: string | null;
  quantity: number;
  itemTotal: number;
}

export interface OrderRestaurantGroupPayload {
  restaurant: CartRestaurantPayload;
  items: OrderRestaurantItemPayload[];
  subtotal: number;
}

export interface OrderPayload {
  id: ApiId;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress?: string | null;
  phone?: string | null;
  pricing: OrderPricingPayload;
  restaurants: OrderRestaurantGroupPayload[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OrdersDataPayload {
  orders: OrderPayload[];
  pagination: ApiPaginationMeta;
  filter?: {
    status?: string;
  };
}

export interface CreateReviewPayload {
  transactionId: string;
  restaurantId: ApiId;
  star: number;
  comment?: string;
  menuIds?: ApiId[];
}

export interface UpdateReviewPayload {
  star?: number;
  comment?: string;
}

export interface ReviewListDataPayload {
  reviews: RestaurantReviewPayload[];
  pagination: ApiPaginationMeta;
}

export type AuthResponse = ApiSuccessResponse<AuthResponsePayload>;
export type UserProfileResponse = ApiSuccessResponse<UserProfilePayload>;
export type RestaurantListResponse = ApiSuccessResponse<RestaurantListDataPayload>;
export type RestaurantDetailResponse = ApiSuccessResponse<RestaurantDetailPayload>;
export type CartResponse = ApiSuccessResponse<CartDataPayload>;
export type CheckoutResponse = ApiSuccessResponse<{ transaction: OrderPayload }>;
export type OrderHistoryResponse = ApiSuccessResponse<OrdersDataPayload>;
export type ReviewListResponse = ApiSuccessResponse<ReviewListDataPayload>;
