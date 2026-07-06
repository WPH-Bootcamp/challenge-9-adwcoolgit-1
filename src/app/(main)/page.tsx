'use client';

import { startTransition, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/shared/button';
import { useSessionState } from '@/features/auth/hooks';
import { HomeCategoryStrip } from '@/features/home/components/home-category-strip';
import { HomeFooter } from '@/features/home/components/home-footer';
import { HomeHero } from '@/features/home/components/home-hero';
import { HomeRestaurantCard } from '@/features/home/components/home-restaurant-card';
import { DiscoveryFilterBar } from '@/features/restaurants/components/filters/discovery-filter-bar';
import {
  defaultDiscoveryState,
  getDiscoveryLimit,
  isDiscoveryStateActive,
  mergeDiscoveryState,
  parseDiscoveryState,
  serializeDiscoveryState,
} from '@/features/restaurants/discovery-state';
import {
  useDiscoveryRestaurantFeed,
  useRecommendedFeed,
  useRestaurantFeed,
} from '@/features/restaurants/hooks';
import type { RestaurantCard } from '@/types/domain';

export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useSessionState();
  const discoveryState = useMemo(
    () => parseDiscoveryState(searchParams),
    [searchParams]
  );
  const isDiscoveryActive = isDiscoveryStateActive(discoveryState);
  const allRestaurantsQuery = useRestaurantFeed(24);
  const discoveryQuery = useDiscoveryRestaurantFeed(discoveryState);
  const recommendedQuery = useRecommendedFeed();
  const [recommendedVisibleCount, setRecommendedVisibleCount] = useState(12);

  const recommendedRestaurants = useMemo(
    () =>
      getRecommendedRestaurants({
        isAuthenticated,
        allRestaurants: allRestaurantsQuery.data?.restaurants ?? [],
        recommended: recommendedQuery.data ?? [],
      }),
    [
      allRestaurantsQuery.data?.restaurants,
      isAuthenticated,
      recommendedQuery.data,
    ]
  );
  const visibleRecommendedRestaurants = recommendedRestaurants.slice(
    0,
    recommendedVisibleCount
  );
  const categoryOptions = useMemo(() => {
    const allCategories = new Set<string>();

    (allRestaurantsQuery.data?.restaurants ?? []).forEach((restaurant) => {
      restaurant.categories.forEach((category) => allCategories.add(category));
    });

    (discoveryQuery.data?.restaurants ?? []).forEach((restaurant) => {
      restaurant.categories.forEach((category) => allCategories.add(category));
    });

    if (discoveryState.category) {
      allCategories.add(discoveryState.category);
    }

    return Array.from(allCategories).sort((left, right) =>
      left.localeCompare(right)
    );
  }, [
    allRestaurantsQuery.data?.restaurants,
    discoveryQuery.data?.restaurants,
    discoveryState.category,
  ]);

  const discoveryTotal = discoveryQuery.data?.pagination.total ?? 0;
  const discoveryLimit = getDiscoveryLimit(discoveryState);
  const canShowMoreDiscovery =
    isDiscoveryActive && discoveryLimit < discoveryTotal;
  const canShowMoreRecommended =
    !isDiscoveryActive &&
    recommendedVisibleCount < recommendedRestaurants.length;

  function replaceDiscoveryState(queryString: string) {
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleDiscoveryPatch(patch: Partial<typeof defaultDiscoveryState>) {
    const nextState = mergeDiscoveryState(discoveryState, patch);
    replaceDiscoveryState(serializeDiscoveryState(nextState));
  }

  function handleSearchSubmit(value: string) {
    const nextQuery = value.trim();

    if (!nextQuery && !discoveryState.category && !discoveryState.rating) {
      replaceDiscoveryState('');
      return;
    }

    handleDiscoveryPatch({ q: nextQuery });
  }

  const sectionTitle = isDiscoveryActive
    ? discoveryState.q
      ? 'Search Results'
      : 'Explore Restaurants'
    : 'Recommended';
  const sectionRestaurants = isDiscoveryActive
    ? (discoveryQuery.data?.restaurants ?? [])
    : visibleRecommendedRestaurants;
  const isSectionLoading = isDiscoveryActive
    ? discoveryQuery.isLoading
    : allRestaurantsQuery.isLoading;
  const hasSectionError = isDiscoveryActive
    ? discoveryQuery.isError
    : allRestaurantsQuery.isError ||
      (recommendedQuery.isError && isAuthenticated);

  return (
    <main className='min-h-screen bg-white'>
      <HomeHero
        isAuthenticated={isAuthenticated}
        user={user}
        searchValue={discoveryState.q}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className='mx-auto flex max-w-300 flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 md:px-8 lg:gap-12 lg:px-0 lg:py-12'>
        <HomeCategoryStrip />

        <DiscoveryFilterBar
          categoryOptions={categoryOptions}
          state={discoveryState}
          isBusy={discoveryQuery.isFetching}
          onCategoryChange={(value) =>
            handleDiscoveryPatch({ category: value })
          }
          onRatingChange={(value) => handleDiscoveryPatch({ rating: value })}
          onReset={() => replaceDiscoveryState('')}
        />

        <section className='flex flex-col gap-8'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='text-[28px] font-extrabold leading-9.5 text-(--color-neutral-950) lg:text-[32px] lg:leading-10.5'>
              {sectionTitle}
            </h2>
            <Button
              type='button'
              variant='text'
              size='text'
              onClick={() => {
                if (isDiscoveryActive) {
                  handleDiscoveryPatch({
                    page: '1',
                    limit: String(discoveryTotal || discoveryLimit),
                  });
                  return;
                }

                setRecommendedVisibleCount(recommendedRestaurants.length);
              }}
              className='font-extrabold'
            >
              See All
            </Button>
          </div>

          {isSectionLoading ? (
            <RecommendationMessage
              title={
                isDiscoveryActive ? 'Loading restaurants' : 'Loading discovery'
              }
              description={
                isDiscoveryActive
                  ? 'Applying your search and filters to the restaurant list.'
                  : 'Fetching restaurants and curated sections for your next meal.'
              }
            />
          ) : hasSectionError ? (
            <RecommendationMessage
              title={
                isDiscoveryActive
                  ? 'Unable to load filtered restaurants'
                  : 'Unable to load restaurants'
              }
              description='We could not load the restaurant data right now. Please try again in a moment.'
              tone='error'
            />
          ) : sectionRestaurants.length === 0 ? (
            <RecommendationMessage
              title={
                isDiscoveryActive
                  ? 'No restaurants match your filters'
                  : 'No recommendations yet'
              }
              description={
                isDiscoveryActive
                  ? 'Try a different keyword or reset your category and rating filters.'
                  : 'Restaurant recommendations are not available right now.'
              }
            />
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-[370px_396px_396px] xl:justify-between'>
              {sectionRestaurants.map((restaurant) => (
                <HomeRestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}

          {canShowMoreRecommended ? (
            <div className='flex justify-center'>
              <Button
                type='button'
                variant='neutralOutline'
                size='compact'
                onClick={() =>
                  setRecommendedVisibleCount((current) => current + 6)
                }
              >
                Show More
              </Button>
            </div>
          ) : null}

          {canShowMoreDiscovery ? (
            <div className='flex justify-center'>
              <Button
                type='button'
                variant='neutralOutline'
                size='compact'
                onClick={() =>
                  handleDiscoveryPatch({
                    page: '1',
                    limit: String(discoveryLimit + 6),
                  })
                }
              >
                Show More
              </Button>
            </div>
          ) : null}
        </section>
      </div>

      <HomeFooter />
    </main>
  );
}

function RecommendationMessage({
  title,
  description,
  tone = 'neutral',
}: {
  title: string;
  description: string;
  tone?: 'neutral' | 'error';
}) {
  const toneClassName =
    tone === 'error'
      ? 'border-[#FEE4E2] bg-[#FEF3F2] text-[#7A271A]'
      : 'border-(--color-neutral-200) bg-(--color-neutral-25) text-(--color-neutral-700)';

  return (
    <div className={`rounded-2xl border p-6 ${toneClassName}`}>
      <p className='text-lg font-extrabold leading-8 tracking-tight'>{title}</p>
      <p className='mt-1 text-base font-normal leading-7.5 tracking-tight'>
        {description}
      </p>
    </div>
  );
}

function getRecommendedRestaurants({
  isAuthenticated,
  allRestaurants,
  recommended,
}: {
  isAuthenticated: boolean;
  allRestaurants: RestaurantCard[];
  recommended: RestaurantCard[];
}) {
  if (isAuthenticated && recommended.length > 0) {
    return recommended;
  }

  return allRestaurants;
}

