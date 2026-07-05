import type {
  ApiId,
  CartGroupPayload,
  CartItemPayload,
  MenuItemPayload,
  OrderPayload,
  OrderPricingPayload,
  RestaurantCoordinatesPayload,
  RestaurantDetailPayload,
  RestaurantListItemPayload,
  RestaurantReviewPayload,
  ReviewedMenuPayload,
  UserProfilePayload,
} from "@/types/api";

export interface AuthUser {
  id: ApiId;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string | null;
}

export interface AuthSession {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  persistedAt: number | null;
  hasHydrated: boolean;
}

export interface DiscoveryState {
  q: string;
  category: string;
  rating: string;
  priceMin: string;
  priceMax: string;
  range: string;
  page: string;
  limit: string;
}

export interface RestaurantCard {
  id: ApiId;
  name: string;
  imageUrl: string | null;
  galleryImages: string[];
  location: string | null;
  categories: string[];
  rating: number | null;
  reviewCount: number;
  menuCount: number;
  priceMin: number | null;
  priceMax: number | null;
  distance: number | null;
}

export interface ReviewMenuSummary {
  menuId: ApiId;
  name: string;
  price: number;
  type: string | null;
  imageUrl: string | null;
  quantity: number | null;
}

export interface ReviewSummary {
  reviewId: ApiId;
  transactionId: string | null;
  authorName: string;
  authorAvatar: string | null;
  star: number;
  comment: string | null;
  createdAt: string | null;
  menuIds: ApiId[];
  menus: ReviewMenuSummary[];
}

export interface MenuItem {
  id: ApiId;
  restaurantId: ApiId | null;
  name: string;
  imageUrl: string | null;
  price: number;
  type: string | null;
}

export interface RestaurantDetail extends RestaurantCard {
  averageRating: number | null;
  coordinates: RestaurantCoordinatesPayload | null;
  totalMenus: number;
  totalReviews: number;
  menus: MenuItem[];
  reviews: ReviewSummary[];
}

export interface BasketItem {
  id: ApiId;
  restaurantId: ApiId;
  menuId: ApiId;
  name: string;
  imageUrl: string | null;
  type: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface BasketGroup {
  restaurantId: ApiId;
  restaurantName: string;
  restaurantLogo: string | null;
  items: BasketItem[];
  subtotal: number;
}

export interface OrderRecordItem {
  menuId: ApiId;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  itemTotal: number;
}

export interface OrderRecordRestaurant {
  restaurantId: ApiId;
  restaurantName: string;
  restaurantLogo: string | null;
  items: OrderRecordItem[];
  subtotal: number;
}

export interface OrderRecord {
  id: ApiId;
  transactionId: string;
  status: string;
  restaurants: OrderRecordRestaurant[];
  deliveryAddress: string | null;
  phone: string | null;
  paymentMethod: string;
  pricing: OrderPricingPayload;
  createdAt: string | null;
  updatedAt: string | null;
  total: number;
}

function getRestaurantImage(payload: { logo?: string | null; images?: string[] }): string | null {
  return payload.logo ?? payload.images?.[0] ?? null;
}

function getMenuName(payload: MenuItemPayload): string {
  return payload.foodName ?? payload.food_name ?? "";
}

function toReviewMenuSummary(payload: ReviewedMenuPayload): ReviewMenuSummary {
  return {
    menuId: payload.menuId,
    name: payload.menuName,
    price: payload.price,
    type: payload.type ?? null,
    imageUrl: payload.image ?? null,
    quantity: payload.quantity ?? null,
  };
}

export function toAuthUser(profile: UserProfilePayload): AuthUser {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? null,
    avatar: profile.avatar ?? null,
    latitude: profile.latitude ?? null,
    longitude: profile.longitude ?? null,
    createdAt: profile.createdAt ?? null,
  };
}

export function toRestaurantCard(payload: RestaurantListItemPayload): RestaurantCard {
  return {
    id: payload.id,
    name: payload.name,
    imageUrl: getRestaurantImage(payload),
    galleryImages: payload.images ?? [],
    location: payload.place ?? null,
    categories: payload.category ? [payload.category] : [],
    rating: payload.star ?? null,
    reviewCount: payload.reviewCount ?? 0,
    menuCount: payload.menuCount ?? 0,
    priceMin: payload.priceRange?.min ?? null,
    priceMax: payload.priceRange?.max ?? null,
    distance: payload.distance ?? null,
  };
}

export function toReviewSummary(payload: RestaurantReviewPayload): ReviewSummary {
  const menus = (payload.menus ?? []).map(toReviewMenuSummary);

  return {
    reviewId: payload.id,
    transactionId: payload.transactionId ?? null,
    authorName: payload.user?.name ?? "Anonymous",
    authorAvatar: payload.user?.avatar ?? null,
    star: payload.star,
    comment: payload.comment ?? null,
    createdAt: payload.createdAt ?? null,
    menuIds: menus.map((menu) => menu.menuId),
    menus,
  };
}

export function toMenuItem(payload: MenuItemPayload, fallbackRestaurantId: ApiId | null = null): MenuItem {
  return {
    id: payload.id,
    restaurantId: payload.restoId ?? payload.resto_id ?? fallbackRestaurantId,
    name: getMenuName(payload),
    imageUrl: payload.image ?? null,
    price: payload.price,
    type: payload.type ?? null,
  };
}

export function toRestaurantDetail(payload: RestaurantDetailPayload): RestaurantDetail {
  const card = toRestaurantCard(payload);

  return {
    ...card,
    rating: payload.averageRating ?? card.rating,
    averageRating: payload.averageRating ?? payload.star ?? null,
    coordinates: payload.coordinates ?? null,
    totalMenus: payload.totalMenus ?? payload.menus?.length ?? 0,
    totalReviews: payload.totalReviews ?? payload.reviews?.length ?? 0,
    menus: (payload.menus ?? []).map((menu) => toMenuItem(menu, payload.id)),
    reviews: (payload.reviews ?? []).map(toReviewSummary),
  };
}

export function toBasketItem(payload: CartItemPayload, restaurantId: ApiId): BasketItem {
  return {
    id: payload.id,
    restaurantId,
    menuId: payload.menu.id,
    name: payload.menu.foodName,
    imageUrl: payload.menu.image ?? null,
    type: payload.menu.type ?? null,
    unitPrice: payload.menu.price,
    quantity: payload.quantity,
    lineTotal: payload.itemTotal ?? payload.menu.price * payload.quantity,
  };
}

export function toBasketGroup(payload: CartGroupPayload): BasketGroup {
  const items = payload.items.map((item) => toBasketItem(item, payload.restaurant.id));

  return {
    restaurantId: payload.restaurant.id,
    restaurantName: payload.restaurant.name,
    restaurantLogo: payload.restaurant.logo ?? null,
    items,
    subtotal: payload.subtotal,
  };
}

export function toOrderRecord(payload: OrderPayload): OrderRecord {
  return {
    id: payload.id,
    transactionId: payload.transactionId,
    status: payload.status,
    restaurants: payload.restaurants.map((group) => ({
      restaurantId: group.restaurant.id,
      restaurantName: group.restaurant.name,
      restaurantLogo: group.restaurant.logo ?? null,
      subtotal: group.subtotal,
      items: group.items.map((item) => ({
        menuId: item.menuId,
        name: item.menuName,
        price: item.price,
        imageUrl: item.image ?? null,
        quantity: item.quantity,
        itemTotal: item.itemTotal,
      })),
    })),
    deliveryAddress: payload.deliveryAddress ?? null,
    phone: payload.phone ?? null,
    paymentMethod: payload.paymentMethod,
    pricing: payload.pricing,
    createdAt: payload.createdAt ?? null,
    updatedAt: payload.updatedAt ?? null,
    total: payload.pricing.totalPrice,
  };
}
