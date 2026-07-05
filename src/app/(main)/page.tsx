"use client";

import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { RestaurantCardView } from "@/components/shared/restaurant-card";
import { RestaurantSection } from "@/components/shared/restaurant-section";
import { useSessionState } from "@/features/auth/hooks";
import {
  useBestSellerFeed,
  useNearbyFeed,
  useRecommendedFeed,
  useRestaurantFeed,
} from "@/features/restaurants/hooks";
import type { RestaurantCard } from "@/types/domain";

function SectionGrid({
  items,
  emptyTitle,
  emptyDescription,
  eyebrow,
}: {
  items: RestaurantCard[];
  emptyTitle: string;
  emptyDescription: string;
  eyebrow?: string;
}) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((restaurant) => (
        <RestaurantCardView key={restaurant.id} restaurant={restaurant} eyebrow={eyebrow} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, user } = useSessionState();
  const allRestaurantsQuery = useRestaurantFeed();
  const bestSellerQuery = useBestSellerFeed();
  const recommendedQuery = useRecommendedFeed();
  const nearbyQuery = useNearbyFeed();

  const isInitialLoading = allRestaurantsQuery.isLoading || bestSellerQuery.isLoading;
  const hasCriticalError = allRestaurantsQuery.isError && bestSellerQuery.isError;

  if (isInitialLoading) {
    return (
      <main className="min-h-screen bg-(--color-page) px-6 py-10 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-[1280px]">
          <LoadingState
            title="Loading discovery"
            description="Fetching restaurants and curated sections for your next meal."
          />
        </div>
      </main>
    );
  }

  if (hasCriticalError) {
    return (
      <main className="min-h-screen bg-(--color-page) px-6 py-10 lg:px-12 xl:px-20">
        <div className="mx-auto max-w-[1280px]">
          <ErrorState
            description="We could not load the discovery page right now. Please try again in a moment."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-page) px-6 py-10 lg:px-12 xl:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
        <section className="overflow-hidden rounded-[36px] bg-white px-7 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex rounded-full bg-[rgba(193,33,22,0.08)] px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-(--color-primary)">
                Restaurant Discovery
              </span>
              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold leading-tight text-(--color-neutral-950) sm:text-5xl">
                  {isAuthenticated && user?.name
                    ? `Welcome back, ${user.name.split(" ")[0]}`
                    : "Find your next favorite meal"}
                </h1>
                <p className="max-w-2xl text-base font-medium leading-[30px] tracking-[-0.03em] text-(--color-neutral-600) sm:text-lg">
                  Explore popular restaurants, neighborhood favorites, and curated picks in one place.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[rgba(10,13,18,0.1)] px-6 text-base font-bold text-(--color-neutral-950)"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-(--color-primary) px-6 text-base font-bold text-(--color-neutral-25)"
                  >
                    Create account
                  </Link>
                </>
              ) : (
                <span className="inline-flex h-12 items-center justify-center rounded-full bg-[rgba(193,33,22,0.08)] px-6 text-base font-bold text-(--color-primary)">
                  Signed in
                </span>
              )}
            </div>
          </div>
        </section>

        <RestaurantSection
          title="Popular near everyone"
          description="A quick scan of restaurants diners are opening first today."
        >
          <SectionGrid
            items={allRestaurantsQuery.data?.restaurants ?? []}
            emptyTitle="No restaurants yet"
            emptyDescription="No public restaurant data is available right now."
            eyebrow="Spotlight"
          />
        </RestaurantSection>

        <RestaurantSection
          title="Best Sellers"
          description="Top-rated places that consistently stand out with diners."
        >
          <SectionGrid
            items={bestSellerQuery.data?.restaurants ?? []}
            emptyTitle="No best sellers yet"
            emptyDescription="Best seller recommendations are not available right now."
            eyebrow="Best seller"
          />
        </RestaurantSection>

        {isAuthenticated ? (
          <RestaurantSection
            title="Recommended for you"
            description="Personalized restaurant picks based on your account activity."
          >
            {recommendedQuery.isError ? (
              <ErrorState description="We could not load your recommendations right now." />
            ) : recommendedQuery.isLoading ? (
              <LoadingState
                title="Loading recommendations"
                description="Curating restaurants just for you."
              />
            ) : (
              <SectionGrid
                items={recommendedQuery.data ?? []}
                emptyTitle="No recommendations yet"
                emptyDescription="Order history or account signals are not enough yet for tailored picks."
                eyebrow="For you"
              />
            )}
          </RestaurantSection>
        ) : null}

        {isAuthenticated && user?.latitude !== null && user?.latitude !== undefined && user?.longitude !== null && user?.longitude !== undefined ? (
          <RestaurantSection
            title="Nearby"
            description="Places close to your saved location for a faster delivery decision."
          >
            {nearbyQuery.isError ? (
              <ErrorState description="We could not load nearby restaurants right now." />
            ) : nearbyQuery.isLoading ? (
              <LoadingState
                title="Loading nearby spots"
                description="Checking restaurants around your saved location."
              />
            ) : (
              <SectionGrid
                items={nearbyQuery.data ?? []}
                emptyTitle="No nearby restaurants"
                emptyDescription="No restaurants were found close to your saved location."
                eyebrow="Nearby"
              />
            )}
          </RestaurantSection>
        ) : null}
      </div>
    </main>
  );
}
