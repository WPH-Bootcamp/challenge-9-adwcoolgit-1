import { RestaurantDetailPage } from "@/features/restaurants/components/detail/restaurant-detail-page";

interface RestaurantDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantDetailRoute({
  params,
}: RestaurantDetailRouteProps) {
  const { id } = await params;

  return <RestaurantDetailPage restaurantId={id} />;
}
