'use client';

import Image from 'next/image';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Star, X } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/shared/skeleton';
import { checkIconUrl, passthroughLoader } from '@/features/auth/constants';
import { useSessionState } from '@/features/auth/hooks';
import { useCartQuery } from '@/features/cart/hooks';
import { HomeFooter } from '@/features/home/components/home-footer';
import { HomeRestaurantCard } from '@/features/home/components/home-restaurant-card';
import { RestaurantDetailHeader } from '@/features/restaurants/components/detail/restaurant-detail-header';
import {
  getDiscoveryLimit,
  mergeDiscoveryState,
  parseDiscoveryState,
  serializeDiscoveryState,
} from '@/features/restaurants/discovery-state';
import { useDiscoveryRestaurantFeed } from '@/features/restaurants/hooks';

const CATEGORY_PAGE_DEFAULT_LIMIT = '8';

const distanceOptions = [
  { label: 'Nearby', value: '' },
  { label: 'Within 1 km', value: '1' },
  { label: 'Within 3 km', value: '3' },
  { label: 'Within 5 km', value: '5' },
] as const;

const ratingOptions = ['5', '4', '3', '2', '1'] as const;

export function CategoryPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasHydrated, isAuthenticated, user } = useSessionState();
  const cartQuery = useCartQuery();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const parsedState = useMemo(
    () => parseDiscoveryState(searchParams),
    [searchParams]
  );
  const discoveryState = useMemo(() => {
    if (searchParams.get('limit')) {
      return parsedState;
    }

    return {
      ...parsedState,
      limit: CATEGORY_PAGE_DEFAULT_LIMIT,
    };
  }, [parsedState, searchParams]);
  const discoveryQuery = useDiscoveryRestaurantFeed(discoveryState);

  const cartCount = cartQuery.data?.summary.totalItems ?? 0;
  const sectionTitle = getCategoryPageTitle(discoveryState);
  const totalRestaurants = discoveryQuery.data?.pagination.total ?? 0;
  const currentLimit = getDiscoveryLimit(discoveryState);
  const canShowMore = currentLimit < totalRestaurants;

  useEffect(() => {
    if (!isFilterDrawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterDrawerOpen]);

  function replaceDiscoveryState(queryString: string) {
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleDiscoveryPatch(patch: Partial<typeof discoveryState>) {
    const nextState = mergeDiscoveryState(discoveryState, patch);
    replaceDiscoveryState(serializeDiscoveryState(nextState));
  }

  if (!hasHydrated) {
    return (
      <main className='min-h-screen bg-(--color-neutral-50)'>
        <CategoryPageSkeleton />
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-(--color-neutral-50)'>
      <RestaurantDetailHeader
        isAuthenticated={isAuthenticated}
        user={user}
        cartCount={cartCount}
      />

      <div className='mx-auto flex max-w-360 flex-col gap-4 px-4 py-4 sm:gap-8 sm:px-6 sm:py-8 md:px-8 lg:px-0 lg:py-12'>
        <h1 className='text-display-xs font-extrabold leading-9 text-neutral-950 sm:text-display-md sm:leading-10.5'>
          {sectionTitle}
        </h1>

        <button
          type='button'
          onClick={() => setIsFilterDrawerOpen(true)}
          className='flex cursor-pointer items-center justify-between rounded-[12px] bg-white p-3 shadow-[0_0_10px_rgba(203,202,202,0.25)] lg:hidden'
        >
          <span className='text-sm font-extrabold leading-7 text-neutral-950'>
            FILTER
          </span>
          <SlidersHorizontal className='size-5 text-neutral-950' strokeWidth={2} />
        </button>

        <div className='grid gap-6 lg:grid-cols-[266px_minmax(0,1fr)] lg:items-start lg:gap-10'>
          <aside className='hidden lg:block'>
            <FilterPanel
              discoveryState={discoveryState}
              onDiscoveryPatch={handleDiscoveryPatch}
            />
          </aside>

          <section className='min-w-0'>
            {discoveryQuery.isLoading ? (
              <CategoryRestaurantGridSkeleton />
            ) : discoveryQuery.isError ? (
              <ErrorState
                title='Unable to load restaurants'
                description='We could not load restaurant discovery data right now. Please try again in a moment.'
              />
            ) : (discoveryQuery.data?.restaurants.length ?? 0) === 0 ? (
              <EmptyState
                title='No restaurants found'
                description='Try changing the distance, price, or rating filters to see more restaurants.'
              />
            ) : (
              <div className='flex flex-col gap-4 sm:gap-5'>
                <div className='grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2'>
                  {discoveryQuery.data?.restaurants.map((restaurant) => (
                    <HomeRestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                {canShowMore ? (
                  <div className='flex justify-center xl:justify-start'>
                    <Button
                      type='button'
                      variant='neutralOutline'
                      size='compact'
                      onClick={() =>
                        handleDiscoveryPatch({
                          page: '1',
                          limit: String(currentLimit + 4),
                        })
                      }
                    >
                      Show More
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>

      {isFilterDrawerOpen ? (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <button
            type='button'
            aria-label='Close filter drawer'
            className='absolute inset-0 bg-black/50'
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className='absolute left-0 top-0 h-full w-[298px] bg-white p-4'>
            <FilterPanel
              discoveryState={discoveryState}
              onDiscoveryPatch={handleDiscoveryPatch}
              compact
            />
          </div>
          <button
            type='button'
            aria-label='Close filter drawer'
            onClick={() => setIsFilterDrawerOpen(false)}
            className='absolute left-[282px] top-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-950 shadow-[0_0_10px_rgba(203,202,202,0.25)]'
          >
            <X className='size-5' strokeWidth={2} />
          </button>
        </div>
      ) : null}

      <HomeFooter variant='detail' />
    </main>
  );
}

function FilterPanel({
  discoveryState,
  onDiscoveryPatch,
  compact = false,
}: {
  discoveryState: {
    q: string;
    category: string;
    rating: string;
    priceMin: string;
    priceMax: string;
    range: string;
    page: string;
    limit: string;
  };
  onDiscoveryPatch: (
    patch: Partial<{
      q: string;
      category: string;
      rating: string;
      priceMin: string;
      priceMax: string;
      range: string;
      page: string;
      limit: string;
    }>
  ) => void;
  compact?: boolean;
}) {
  return (
    <div className='rounded-[12px] bg-white py-4 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <FilterSection>
        <p className={`text-neutral-950 ${compact ? 'text-base font-bold leading-7.5 tracking-tight' : 'text-base font-extrabold leading-7.5'}`}>
          FILTER
        </p>
        <p className={`text-neutral-950 ${compact ? 'text-base font-extrabold leading-7.5' : 'text-lg font-extrabold leading-8 tracking-tight'}`}>
          Distance
        </p>
        <div className='flex flex-col gap-4'>
          {distanceOptions.map((option) => (
            <FilterCheckboxRow
              key={option.label}
              label={option.label}
              compact={compact}
              checked={discoveryState.range === option.value}
              onClick={() =>
                onDiscoveryPatch({
                  range:
                    option.value === ''
                      ? ''
                      : discoveryState.range === option.value
                        ? ''
                        : option.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterDivider />

      <FilterSection>
        <p className={`text-neutral-950 ${compact ? 'text-base font-extrabold leading-7.5' : 'text-lg font-extrabold leading-8 tracking-tight'}`}>
          Price
        </p>
        <PriceFilterForm
          compact={compact}
          key={`${discoveryState.priceMin}:${discoveryState.priceMax}`}
          initialPriceMin={discoveryState.priceMin}
          initialPriceMax={discoveryState.priceMax}
          onApply={(priceMin, priceMax) =>
            onDiscoveryPatch({ priceMin, priceMax })
          }
        />
      </FilterSection>

      <FilterDivider />

      <FilterSection>
        <p className={`text-neutral-950 ${compact ? 'text-base font-extrabold leading-7.5' : 'text-lg font-extrabold leading-8 tracking-tight'}`}>
          Rating
        </p>
        <div className='flex flex-col'>
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              type='button'
              onClick={() =>
                onDiscoveryPatch({
                  rating: discoveryState.rating === rating ? '' : rating,
                })
              }
              className='flex cursor-pointer items-center gap-2 px-2 py-2 text-left'
            >
              <CheckboxMark checked={discoveryState.rating === rating} />
              <div className='flex items-center gap-0.5'>
                <Star className='size-6 fill-[#FDB022] text-[#FDB022]' />
                <span className={`text-neutral-950 ${compact ? 'text-sm font-normal leading-7 tracking-tight' : 'text-base font-normal leading-7.5 tracking-tight'}`}>
                  {rating}
                </span>
              </div>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ children }: { children: React.ReactNode }) {
  return <div className='flex flex-col gap-2.5 px-4'>{children}</div>;
}

function FilterDivider() {
  return <div className='my-4 h-px w-full bg-neutral-200' />;
}

function FilterCheckboxRow({
  label,
  checked,
  onClick,
  compact = false,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex cursor-pointer items-center gap-2 text-left'
    >
      <CheckboxMark checked={checked} />
      <span className={`text-neutral-950 ${compact ? 'text-sm font-normal leading-7 tracking-tight' : 'text-base font-normal leading-7.5 tracking-tight'}`}>
        {label}
      </span>
    </button>
  );
}

function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 flex-none items-center justify-center rounded-[6px] border transition-colors ${
        checked
          ? 'border-(--color-primary) bg-(--color-primary)'
          : 'border-[#D5D7DA] bg-white'
      }`}
    >
      {checked ? (
        <Image
          loader={passthroughLoader}
          unoptimized
          src={checkIconUrl}
          alt=''
          width={12}
          height={12}
          className='h-3 w-3'
        />
      ) : null}
    </span>
  );
}

function PriceFilterForm({
  initialPriceMin,
  initialPriceMax,
  onApply,
  compact = false,
}: {
  initialPriceMin: string;
  initialPriceMax: string;
  onApply: (priceMin: string, priceMax: string) => void;
  compact?: boolean;
}) {
  const [priceMin, setPriceMin] = useState(initialPriceMin);
  const [priceMax, setPriceMax] = useState(initialPriceMax);

  function normalizeNumericValue(value: string) {
    return value.replace(/\D/g, '');
  }

  function applyCurrentValues() {
    onApply(normalizeNumericValue(priceMin), normalizeNumericValue(priceMax));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        applyCurrentValues();
      }}
      className='flex flex-col gap-2.5'
    >
      <PriceInput
        compact={compact}
        placeholder='Minimum Price'
        value={priceMin}
        onChange={setPriceMin}
        onBlur={applyCurrentValues}
      />
      <PriceInput
        compact={compact}
        placeholder='Maximum Price'
        value={priceMax}
        onChange={setPriceMax}
        onBlur={applyCurrentValues}
      />
    </form>
  );
}

function PriceInput({
  placeholder,
  value,
  onChange,
  onBlur,
  compact = false,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  compact?: boolean;
}) {
  return (
    <label className={`flex items-center gap-2 rounded-[8px] border border-neutral-300 p-2 ${compact ? 'h-12' : ''}`}>
      <span className={`flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[4px] ${compact ? 'bg-neutral-200 text-sm font-semibold leading-7 tracking-tight' : 'bg-neutral-100 text-base font-bold leading-7.5 tracking-tight'} text-neutral-950`}>
        Rp
      </span>
      <input
        type='text'
        inputMode='numeric'
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`min-w-0 flex-1 border-none bg-transparent p-0 text-neutral-950 outline-none placeholder:text-neutral-500 ${compact ? 'text-sm font-normal leading-7 tracking-tight' : 'text-base font-normal leading-7.5 tracking-tight'}`}
      />
    </label>
  );
}

function CategoryPageSkeleton() {
  return (
    <div className='mx-auto flex max-w-360 flex-col gap-8 px-4 py-8 sm:px-6 md:px-8 lg:px-0 lg:py-12'>
      <Skeleton className='h-10 w-52 rounded-xl' />
      <div className='grid gap-6 lg:grid-cols-[266px_minmax(0,1fr)] lg:items-start lg:gap-10'>
        <aside className='hidden rounded-[12px] bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)] lg:block'>
          <div className='flex flex-col gap-4'>
            <Skeleton className='h-7 w-24 rounded-xl' />
            <Skeleton className='h-8 w-28 rounded-xl' />
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className='flex items-center gap-2'>
                <Skeleton className='h-5 w-5 rounded-[6px]' />
                <Skeleton className='h-7 w-32 rounded-xl' />
              </div>
            ))}
            <Skeleton className='h-px w-full rounded-none' />
            <Skeleton className='h-8 w-20 rounded-xl' />
            <Skeleton className='h-14 w-full rounded-[8px]' />
            <Skeleton className='h-14 w-full rounded-[8px]' />
            <Skeleton className='h-px w-full rounded-none' />
            <Skeleton className='h-8 w-24 rounded-xl' />
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className='flex items-center gap-2'>
                <Skeleton className='h-5 w-5 rounded-[6px]' />
                <Skeleton className='h-7 w-12 rounded-xl' />
              </div>
            ))}
          </div>
        </aside>

        <div className='space-y-4 lg:hidden'>
          <Skeleton className='h-11 w-full rounded-[12px]' />
          <CategoryRestaurantGridSkeleton />
        </div>

        <div className='hidden lg:block'>
          <CategoryRestaurantGridSkeleton />
        </div>
      </div>
    </div>
  );
}

function CategoryRestaurantGridSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-2'>
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className='rounded-2xl bg-white p-3 sm:p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)]'
        >
          <div className='flex items-center gap-2 sm:gap-3'>
            <Skeleton className='h-[90px] w-[90px] rounded-[12px] sm:h-[120px] sm:w-[120px]' />
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
              <Skeleton className='h-7 w-32 rounded-xl sm:h-8 sm:w-36' />
              <Skeleton className='h-6 w-18 rounded-xl sm:h-7 sm:w-20' />
              <Skeleton className='h-6 w-36 rounded-xl sm:h-7 sm:w-44' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getCategoryPageTitle(state: {
  q: string;
  category: string;
}) {
  if (state.q) {
    return 'Search Results';
  }

  if (state.category) {
    return state.category
      .split(' ')
      .filter(Boolean)
      .map((segment) => segment[0].toUpperCase() + segment.slice(1))
      .join(' ');
  }

  return 'All Restaurant';
}
