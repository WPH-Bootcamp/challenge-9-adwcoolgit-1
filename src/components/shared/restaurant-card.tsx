/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import type { RestaurantCard } from "@/types/domain";

interface RestaurantCardProps {
  restaurant: RestaurantCard;
  eyebrow?: string;
}

function formatPrice(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RestaurantCardView({ restaurant, eyebrow }: RestaurantCardProps) {
  const image = restaurant.imageUrl ?? restaurant.galleryImages[0] ?? null;

  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[rgba(10,13,18,0.08)] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[linear-gradient(135deg,#f5ede4_0%,#fff_100%)]">
        {image ? (
          <img
            src={image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold text-(--color-neutral-600)">
            {restaurant.name}
          </div>
        )}
        {eyebrow ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-(--color-primary)">
            {eyebrow}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold leading-7 text-(--color-neutral-950)">{restaurant.name}</h3>
            <p className="mt-1 text-sm font-medium text-(--color-neutral-600)">{restaurant.location ?? "Location unavailable"}</p>
          </div>
          <div className="rounded-full bg-[rgba(193,33,22,0.08)] px-3 py-1 text-sm font-bold text-(--color-primary)">
            {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {restaurant.categories.length > 0 ? restaurant.categories.map((category) => (
            <span key={category} className="rounded-full bg-(--color-neutral-100) px-3 py-1 text-xs font-semibold text-(--color-neutral-700)">
              {category}
            </span>
          )) : (
            <span className="rounded-full bg-(--color-neutral-100) px-3 py-1 text-xs font-semibold text-(--color-neutral-700)">
              Restaurant
            </span>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--color-neutral-500)">Price range</p>
            <p className="mt-1 text-sm font-bold text-(--color-neutral-950)">
              {formatPrice(restaurant.priceMin)} - {formatPrice(restaurant.priceMax)}
            </p>
          </div>
          {restaurant.distance !== null ? (
            <p className="text-sm font-semibold text-(--color-neutral-600)">{restaurant.distance.toFixed(1)} km</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
