'use client';

import { startTransition, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/shared/button';
import { useSessionState } from '@/features/auth/hooks';
import {
  HomeCategoryStrip,
  type HomeCategoryKey,
} from '@/features/home/components/home-category-strip';
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
  useBestSellerFeed,
  useDiscoveryRestaurantFeed,
  useNearbyFeed,
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
  const bestSellerQuery = useBestSellerFeed(12);
  const nearbyQuery = useNearbyFeed(12);
  const [recommendedVisibleCount, setRecommendedVisibleCount] = useState(12);
  const [activeCategory, setActiveCategory] =
    useState<HomeCategoryKey>('all');

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
  const lunchRestaurants = useMemo(
    () =>
      (allRestaurantsQuery.data?.restaurants ?? []).filter((restaurant) =>
        restaurant.categories.some(
          (category) => category.toLowerCase() === 'lunch'
        )
      ),
    [allRestaurantsQuery.data?.restaurants]
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
    activeCategory === 'all' &&
    recommendedVisibleCount < recommendedRestaurants.length;
  const hasSavedLocation =
    user?.latitude !== null &&
    user?.latitude !== undefined &&
    user?.longitude !== null &&
    user?.longitude !== undefined;

  function replaceDiscoveryState(queryString: string) {
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleDiscoveryPatch(patch: Partial<typeof defaultDiscoveryState>) {
    setActiveCategory('all');
    const nextState = mergeDiscoveryState(discoveryState, patch);
    replaceDiscoveryState(serializeDiscoveryState(nextState));
  }

  function handleSearchSubmit(value: string) {
    setActiveCategory('all');
    const nextQuery = value.trim();
    const hasOtherFilters = Boolean(
      discoveryState.category ||
        discoveryState.rating ||
        discoveryState.priceMin ||
        discoveryState.priceMax ||
        discoveryState.range
    );

    if (!nextQuery && !hasOtherFilters) {
      replaceDiscoveryState('');
      return;
    }

    handleDiscoveryPatch({ q: nextQuery });
  }

  function handleCategorySelect(category: HomeCategoryKey) {
    setActiveCategory(category);

    if (isDiscoveryActive) {
      replaceDiscoveryState('');
    }
  }

  const curatedSection = getCuratedSection({
    activeCategory,
    isAuthenticated,
    hasSavedLocation,
    recommendedRestaurants: visibleRecommendedRestaurants,
    recommendedTotal: recommendedRestaurants.length,
    nearbyRestaurants: nearbyQuery.data ?? [],
    bestSellerRestaurants: bestSellerQuery.data?.restaurants ?? [],
    lunchRestaurants,
    allRestaurantsLoading: allRestaurantsQuery.isLoading,
    allRestaurantsError: allRestaurantsQuery.isError,
    recommendedError: recommendedQuery.isError,
    bestSellerLoading: bestSellerQuery.isLoading,
    bestSellerError: bestSellerQuery.isError,
    nearbyLoading: nearbyQuery.isLoading,
    nearbyError: nearbyQuery.isError,
  });

  const sectionTitle = isDiscoveryActive
    ? discoveryState.q
      ? 'Search Results'
      : 'Explore Restaurants'
    : curatedSection.title;
  const sectionRestaurants = isDiscoveryActive
    ? (discoveryQuery.data?.restaurants ?? [])
    : curatedSection.restaurants;
  const isSectionLoading = isDiscoveryActive
    ? discoveryQuery.isLoading
    : curatedSection.isLoading;
  const hasSectionError = isDiscoveryActive
    ? discoveryQuery.isError
    : curatedSection.isError;

  return (
    <main className='min-h-screen bg-white'>
      <HomeHero
        isAuthenticated={isAuthenticated}
        user={user}
        searchValue={discoveryState.q}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className='mx-auto flex max-w-300 flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 md:px-8 lg:gap-12 lg:px-0 lg:py-12'>
        <HomeCategoryStrip
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />

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
            {isDiscoveryActive || activeCategory === 'all' ? (
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
            ) : null}
          </div>

          {isSectionLoading ? (
            <RecommendationMessage
              title={
                isDiscoveryActive ? 'Loading restaurants' : curatedSection.loadingTitle
              }
              description={
                isDiscoveryActive
                  ? 'Applying your search and filters to the restaurant list.'
                  : curatedSection.loadingDescription
              }
            />
          ) : hasSectionError ? (
            <RecommendationMessage
              title={
                isDiscoveryActive
                  ? 'Unable to load filtered restaurants'
                  : curatedSection.errorTitle
              }
              description={
                isDiscoveryActive
                  ? 'We could not load the restaurant data right now. Please try again in a moment.'
                  : curatedSection.errorDescription
              }
              tone='error'
            />
          ) : sectionRestaurants.length === 0 ? (
            <RecommendationMessage
              title={
                isDiscoveryActive
                  ? 'No restaurants match your filters'
                  : curatedSection.emptyTitle
              }
              description={
                isDiscoveryActive
                  ? 'Try a different keyword or reset your category and rating filters.'
                  : curatedSection.emptyDescription
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

function getCuratedSection({
  activeCategory,
  isAuthenticated,
  hasSavedLocation,
  recommendedRestaurants,
  recommendedTotal,
  nearbyRestaurants,
  bestSellerRestaurants,
  lunchRestaurants,
  allRestaurantsLoading,
  allRestaurantsError,
  recommendedError,
  bestSellerLoading,
  bestSellerError,
  nearbyLoading,
  nearbyError,
}: {
  activeCategory: HomeCategoryKey;
  isAuthenticated: boolean;
  hasSavedLocation: boolean;
  recommendedRestaurants: RestaurantCard[];
  recommendedTotal: number;
  nearbyRestaurants: RestaurantCard[];
  bestSellerRestaurants: RestaurantCard[];
  lunchRestaurants: RestaurantCard[];
  allRestaurantsLoading: boolean;
  allRestaurantsError: boolean;
  recommendedError: boolean;
  bestSellerLoading: boolean;
  bestSellerError: boolean;
  nearbyLoading: boolean;
  nearbyError: boolean;
}) {
  switch (activeCategory) {
    case 'nearby':
      return {
        title: 'Nearby Restaurants',
        restaurants: nearbyRestaurants,
        isLoading: nearbyLoading,
        isError: nearbyError,
        loadingTitle: 'Loading nearby restaurants',
        loadingDescription: 'Looking for restaurants around your saved location.',
        errorTitle: 'Unable to load nearby restaurants',
        errorDescription:
          'We could not load nearby restaurants right now. Please try again in a moment.',
        emptyTitle: isAuthenticated && hasSavedLocation
          ? 'No nearby restaurants found'
          : 'Nearby requires your saved location',
        emptyDescription: isAuthenticated && hasSavedLocation
          ? 'Try another section while we wait for more nearby options.'
          : 'Sign in and complete your location to see nearby restaurants.',
        total: nearbyRestaurants.length,
      };
    case 'bestSeller':
      return {
        title: 'Best Seller',
        restaurants: bestSellerRestaurants,
        isLoading: bestSellerLoading,
        isError: bestSellerError,
        loadingTitle: 'Loading best sellers',
        loadingDescription: 'Fetching the most popular restaurants right now.',
        errorTitle: 'Unable to load best sellers',
        errorDescription:
          'We could not load the best seller list right now. Please try again in a moment.',
        emptyTitle: 'No best sellers yet',
        emptyDescription: 'Best seller restaurants are not available right now.',
        total: bestSellerRestaurants.length,
      };
    case 'lunch':
      return {
        title: 'Lunch Picks',
        restaurants: lunchRestaurants,
        isLoading: allRestaurantsLoading,
        isError: allRestaurantsError,
        loadingTitle: 'Loading lunch picks',
        loadingDescription: 'Finding restaurants that match your lunch craving.',
        errorTitle: 'Unable to load lunch picks',
        errorDescription:
          'We could not load lunch restaurants right now. Please try again in a moment.',
        emptyTitle: 'No lunch restaurants found',
        emptyDescription: 'Try another section while we wait for more lunch options.',
        total: lunchRestaurants.length,
      };
    case 'all':
    default:
      return {
        title: 'Recommended',
        restaurants: recommendedRestaurants,
        isLoading: allRestaurantsLoading,
        isError: allRestaurantsError || (recommendedError && isAuthenticated),
        loadingTitle: 'Loading discovery',
        loadingDescription:
          'Fetching restaurants and curated sections for your next meal.',
        errorTitle: 'Unable to load restaurants',
        errorDescription:
          'We could not load the restaurant data right now. Please try again in a moment.',
        emptyTitle: 'No recommendations yet',
        emptyDescription: 'Restaurant recommendations are not available right now.',
        total: recommendedTotal,
      };
  }
}
