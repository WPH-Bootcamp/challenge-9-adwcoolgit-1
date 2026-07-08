'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Share2, Star } from 'lucide-react';
import BagFillIcon from '@iconify-react/lets-icons/bag-fill';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button, LinkButton } from '@/components/shared/button';
import { ChipButton } from '@/components/shared/chip-button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { RestaurantDetailPageSkeleton } from '@/components/shared/page-skeletons';
import { getApiErrorMessage, useSessionState } from '@/features/auth/hooks';
import { HomeFooter } from '@/features/home/components/home-footer';
import { passthroughLoader } from '@/features/home/constants';
import { RestaurantDetailHeader } from '@/features/restaurants/components/detail/restaurant-detail-header';
import { RestaurantImageGallery } from '@/features/restaurants/components/detail/restaurant-image-gallery';
import { RestaurantMenuCard } from '@/features/restaurants/components/detail/restaurant-menu-card';
import { RestaurantReviewCard } from '@/features/restaurants/components/detail/restaurant-review-card';
import {
  useRestaurantCartSelection,
  useRestaurantDetail,
  useSetRestaurantMenuQuantity,
} from '@/features/restaurants/hooks';

const reviewCountFormatter = new Intl.NumberFormat('id-ID');
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

type MenuFilter = 'all' | 'food' | 'drink';

interface RestaurantDetailPageProps {
  restaurantId: string;
}

function formatDistance(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
  coordinates: { lat: number; long: number } | null
) {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined ||
    !coordinates
  ) {
    return null;
  }

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(coordinates.lat - latitude);
  const longitudeDelta = toRadians(coordinates.long - longitude);
  const originLatitude = toRadians(latitude);
  const destinationLatitude = toRadians(coordinates.lat);
  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);
  const distance =
    2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return `${distance.toFixed(1)} km`;
}

function formatReviewCount(count: number) {
  return `${reviewCountFormatter.format(count)} Ulasan`;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function RestaurantDetailPage({
  restaurantId,
}: RestaurantDetailPageProps) {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useSessionState();
  const detailQuery = useRestaurantDetail(restaurantId);
  const cartSelectionQuery = useRestaurantCartSelection(restaurantId);
  const setRestaurantMenuQuantity = useSetRestaurantMenuQuantity();
  const [menuFilter, setMenuFilter] = useState<MenuFilter>('all');
  const [visibleMenuCount, setVisibleMenuCount] = useState(6);
  const [visibleReviewCount, setVisibleReviewCount] = useState(4);

  const restaurant = detailQuery.data;
  const cartSelection = cartSelectionQuery.data?.itemsByMenuId ?? {};
  const cartCount = cartSelectionQuery.data?.totalItems ?? 0;

  const filteredMenus =
    restaurant?.menus.filter(
      (menu) => menuFilter === 'all' || menu.type === menuFilter
    ) ?? [];
  const visibleMenus = filteredMenus.slice(0, visibleMenuCount);
  const visibleReviews = restaurant?.reviews.slice(0, visibleReviewCount) ?? [];
  const distanceLabel = restaurant
    ? formatDistance(user?.latitude, user?.longitude, restaurant.coordinates)
    : null;
  const averageRating = restaurant?.averageRating ?? restaurant?.rating ?? null;
  const restaurantItemCount = Object.values(cartSelection).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const restaurantSubtotal =
    restaurant?.menus.reduce((sum, menu) => {
      const quantity = cartSelection[String(menu.id)]?.quantity ?? 0;
      return sum + menu.price * quantity;
    }, 0) ?? 0;
  const hasCheckoutSummary = restaurantItemCount > 0 && restaurantSubtotal > 0;

  async function handleShare() {
    if (!restaurant) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: restaurant.name,
          url: window.location.href,
        });
        toast.success('Restaurant link shared.');
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast.success('Restaurant link copied to clipboard.');
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to share this restaurant right now.')
      );
    }
  }

  function handleMenuQuantityChange(
    menuId: string | number,
    targetQuantity: number
  ) {
    if (!restaurant) {
      return;
    }

    if (!isAuthenticated) {
      toast.info('Sign in to add items to your cart.');
      router.push('/login');
      return;
    }

    const currentCartItem = cartSelection[String(menuId)];
    const wasInBasket = Boolean(currentCartItem?.quantity);

    setRestaurantMenuQuantity.mutate(
      {
        restaurantId: restaurant.id,
        menuId,
        targetQuantity,
        cartItemId: currentCartItem?.cartItemId,
      },
      {
        onSuccess: () => {
          if (targetQuantity <= 0) {
            toast.success('Item removed from your cart.');
            return;
          }

          if (wasInBasket) {
            toast.success('Cart updated successfully.');
            return;
          }

          toast.success('Item added to your cart.');
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Unable to update your cart right now.')
          );
        },
      }
    );
  }

  return (
    <main className='min-h-screen bg-white'>
      <RestaurantDetailHeader
        isAuthenticated={isAuthenticated}
        user={user}
        cartCount={cartCount}
      />

      <div className='mx-auto flex max-w-360 flex-col gap-4 py-4 pb-28 sm:gap-10 sm:py-8 sm:pb-32 lg:gap-12 lg:py-12 lg:pb-40'>
        <div className='mx-auto w-full max-w-98.25 px-4 sm:max-w-300 sm:px-6 md:px-8 lg:px-0'>
          {!hasHydrated || detailQuery.isLoading ? (
            <RestaurantDetailPageSkeleton />
          ) : detailQuery.isError || !restaurant ? (
            <ErrorState
              title='Unable to load this restaurant'
              description='We could not load the restaurant details right now. Please try again in a moment.'
            />
          ) : (
            <>
              <section className='flex flex-col gap-4 sm:gap-8'>
                <RestaurantImageGallery
                  images={restaurant.galleryImages}
                  restaurantName={restaurant.name}
                />

                <div className='flex items-start justify-between gap-4 sm:items-center lg:flex-row lg:justify-between'>
                  <div className='flex min-w-0 items-center gap-2 sm:gap-4'>
                    <div className='relative size-22.5 shrink-0 overflow-hidden rounded-full bg-white shadow-[0_0_10px_rgba(203,202,202,0.25)] sm:size-30'>
                      {restaurant.imageUrl || restaurant.galleryImages[0] ? (
                        <Image
                          loader={passthroughLoader}
                          unoptimized
                          src={
                            restaurant.imageUrl ??
                            restaurant.galleryImages[0] ??
                            ''
                          }
                          alt={restaurant.name}
                          fill
                          sizes='120px'
                          className='object-cover'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center px-3 text-center text-base font-bold text-neutral-700 sm:px-4 sm:text-lg'>
                          {restaurant.name}
                        </div>
                      )}
                    </div>
                    <div className='flex min-w-0 flex-1 flex-col gap-0.5 text-neutral-950'>
                      <h1 className='text-md font-extrabold leading-7.5 tracking-tight sm:text-display-md sm:leading-10.5'>
                        {restaurant.name}
                      </h1>
                      <div className='flex items-center gap-1 text-[#FDB022]'>
                        <Star
                          className='size-6 fill-current'
                          strokeWidth={1.5}
                        />
                        <span className='text-sm font-medium leading-7 tracking-tight text-neutral-950 sm:text-lg sm:leading-8'>
                          {averageRating ? averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <div className='flex flex-wrap items-center gap-1.5 text-sm font-normal leading-7 tracking-tight text-neutral-950 sm:gap-2 sm:text-lg sm:leading-8'>
                        <span>
                          {restaurant.location ?? 'Location unavailable'}
                        </span>
                        {distanceLabel ? (
                          <>
                            <span className='size-0.5 rounded-full bg-neutral-950' />
                            <span>{distanceLabel}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <Button
                    type='button'
                    variant='neutralOutline'
                    onClick={handleShare}
                    className='size-11 shrink-0 rounded-full p-0 sm:h-11 sm:w-auto sm:gap-3 sm:px-4 sm:py-3 sm:text-base sm:leading-7.5'
                    aria-label='Share restaurant'
                  >
                    <Share2 className='size-5 sm:size-6' strokeWidth={1.75} />
                    <span className='hidden sm:inline'>Share</span>
                  </Button>
                </div>
              </section>

              <div className='my-4 h-px w-full bg-neutral-300 sm:my-8' />

              <section className='flex flex-col gap-4 pb-6 sm:gap-8 sm:pb-0'>
                <div className='flex flex-col gap-4 sm:gap-6'>
                  <h2 className='text-display-xs font-extrabold leading-9 text-neutral-950 sm:text-display-lg sm:leading-11'>
                    Menu
                  </h2>
                  <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                    <MenuChip
                      label='All Menu'
                      isActive={menuFilter === 'all'}
                      onClick={() => setMenuFilter('all')}
                    />
                    <MenuChip
                      label='Food'
                      isActive={menuFilter === 'food'}
                      onClick={() => setMenuFilter('food')}
                    />
                    <MenuChip
                      label='Drink'
                      isActive={menuFilter === 'drink'}
                      onClick={() => setMenuFilter('drink')}
                    />
                  </div>
                </div>

                {filteredMenus.length > 0 ? (
                  <>
                    <div className='grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4'>
                      {visibleMenus.map((menu) => {
                        const cartItem = cartSelection[String(menu.id)];
                        const quantity = cartItem?.quantity ?? 0;

                        return (
                          <RestaurantMenuCard
                            key={menu.id}
                            menu={menu}
                            quantity={quantity}
                            isPending={setRestaurantMenuQuantity.isPending}
                            onAdd={() => handleMenuQuantityChange(menu.id, 1)}
                            onIncrement={() =>
                              handleMenuQuantityChange(menu.id, quantity + 1)
                            }
                            onDecrement={() =>
                              handleMenuQuantityChange(menu.id, quantity - 1)
                            }
                          />
                        );
                      })}
                    </div>
                    {visibleMenuCount < filteredMenus.length ? (
                      <div className='flex justify-center'>
                        <Button
                          type='button'
                          variant='neutralOutline'
                          size='compact'
                          className='h-10 w-[160px] text-sm leading-7'
                          onClick={() =>
                            setVisibleMenuCount((current) => current + 4)
                          }
                        >
                          Show More
                        </Button>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <EmptyState
                    title='No menu available'
                    description='This restaurant has no menu items in the selected category yet.'
                  />
                )}
              </section>

              <div className='my-4 h-px w-full bg-neutral-300 sm:my-8' />

              <section className='flex flex-col gap-4 sm:gap-8'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-display-xs font-extrabold leading-9 text-neutral-950 sm:text-display-lg sm:leading-11'>
                    Review
                  </h2>
                  <div className='flex items-center gap-1 text-[#FDB022]'>
                    <Star
                      className='size-5 fill-current sm:size-6'
                      strokeWidth={1.5}
                    />
                    <span className='text-sm font-medium leading-7 tracking-tight text-neutral-950 sm:text-lg sm:leading-8'>
                      {averageRating ? averageRating.toFixed(1) : 'New'} (
                      {formatReviewCount(restaurant.totalReviews)})
                    </span>
                  </div>
                </div>

                {visibleReviews.length > 0 ? (
                  <>
                    <div className='grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2'>
                      {visibleReviews.map((review) => (
                        <RestaurantReviewCard
                          key={review.reviewId}
                          review={review}
                        />
                      ))}
                    </div>
                    {visibleReviewCount < restaurant.reviews.length ? (
                      <div className='flex justify-center'>
                        <Button
                          type='button'
                          variant='neutralOutline'
                          size='compact'
                          className='h-10 w-[160px] text-sm leading-7'
                          onClick={() =>
                            setVisibleReviewCount((current) => current + 4)
                          }
                        >
                          Show More
                        </Button>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <EmptyState
                    title='No reviews yet'
                    description='This restaurant has not received public reviews yet.'
                  />
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {restaurant && hasCheckoutSummary ? (
        <section className='fixed inset-x-0 bottom-0 z-40 bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)]'>
          <div className='mx-auto flex h-16 md:h-20 w-full max-w-360 items-center justify-between gap-4 px-4 sm:px-6 md:px-10 lg:px-30'>
            <div className='flex flex-col items-start gap-0.5'>
              <div className='flex items-center gap-2'>
                <BagFillIcon className='size-6 text-neutral-950' />
                <span className='text-sm md:text-md font-normal leading-7 md:leading-7.5 tracking-tight text-neutral-950'>
                  {restaurantItemCount} Items
                </span>
              </div>
              <p className='text-base md:text-xl font-extrabold leading-7.5 md:leading-8.5 text-neutral-950'>
                {formatCurrency(restaurantSubtotal)}
              </p>
            </div>

            {/* Checkout Button */}
            <LinkButton
              href='/cart'
              variant={'primary'}
              className='h-10 md:h-11 w-40 !text-white text-base font-bold leading-7.5 tracking-tight md:w-57.5'
            >
              Checkout
            </LinkButton>
          </div>
        </section>
      ) : null}

      <HomeFooter variant='detail' />
    </main>
  );
}

function MenuChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <ChipButton type='button' active={isActive} onClick={onClick}>
      {label}
    </ChipButton>
  );
}




