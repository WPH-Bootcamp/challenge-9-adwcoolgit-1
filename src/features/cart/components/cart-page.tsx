'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button, LinkButton } from '@/components/shared/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { LoadingState } from '@/components/shared/loading-state';
import { getApiErrorMessage, useSessionState } from '@/features/auth/hooks';
import { HomeFooter } from '@/features/home/components/home-footer';
import { RestaurantDetailHeader } from '@/features/restaurants/components/detail/restaurant-detail-header';
import type { BasketItem } from '@/types/domain';

import { useCartQuery, useClearCart, useUpdateCartItemQuantity } from '../hooks';
import { CartGroupCard } from './cart-group-card';

export function CartPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useSessionState();
  const cartQuery = useCartQuery();
  const updateQuantity = useUpdateCartItemQuantity();
  const clearCart = useClearCart();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const groups = cartQuery.data?.groups ?? [];
  const summary = cartQuery.data?.summary;
  const cartCount = summary?.totalItems ?? 0;
  const isMutating = updateQuantity.isPending || clearCart.isPending;

  function handleQuantityChange(item: BasketItem, targetQuantity: number) {
    updateQuantity.mutate(
      {
        cartItemId: item.id,
        targetQuantity,
      },
      {
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Unable to update your basket right now.')
          );
        },
      }
    );
  }

  function handleClearCart() {
    clearCart.mutate(undefined, {
      onSuccess: () => {
        toast.success('Cart cleared successfully.');
      },
      onError: (error) => {
        toast.error(
          getApiErrorMessage(error, 'Unable to clear your basket right now.')
        );
      },
    });
  }

  if (!hasHydrated || (!isAuthenticated && !cartQuery.data)) {
    return (
      <main className='min-h-screen bg-white'>
        <div className='mx-auto flex min-h-screen max-w-300 items-center justify-center px-4'>
          <LoadingState
            title='Preparing your cart'
            description='Checking your session and loading basket details.'
          />
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-white'>
      <RestaurantDetailHeader
        isAuthenticated={isAuthenticated}
        user={user}
        cartCount={cartCount}
      />

      <div className='mx-auto flex max-w-360 flex-col gap-8 px-4 py-8 sm:px-6 md:px-8 lg:px-30 lg:py-12'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-display-md font-extrabold leading-10.5 text-neutral-950'>
              My Cart
            </h1>
            <p className='text-base font-medium leading-7.5 tracking-tight text-neutral-600'>
              Review grouped items before placing one order across restaurants.
            </p>
          </div>

          {groups.length > 0 ? (
            <Button
              type='button'
              variant='text'
              size='text'
              onClick={handleClearCart}
              disabled={isMutating}
              className='justify-start text-base font-bold sm:justify-center'
            >
              Clear Cart
            </Button>
          ) : null}
        </div>

        {cartQuery.isLoading ? (
          <LoadingState
            title='Loading your basket'
            description='Preparing grouped items and totals for checkout.'
          />
        ) : cartQuery.isError ? (
          <ErrorState
            title='Unable to load your cart'
            description='We could not load your basket right now. Please try again in a moment.'
            action={
              <Button
                type='button'
                variant='primary'
                className='!text-white'
                onClick={() => void cartQuery.refetch()}
              >
                Try Again
              </Button>
            }
          />
        ) : groups.length === 0 ? (
          <div className='flex flex-col gap-4'>
            <EmptyState
              title='Your cart is empty'
              description='Add menu items from a restaurant detail page to start a multi-restaurant checkout.'
            />
            <div className='flex justify-center'>
              <LinkButton href='/' variant='primary' className='!text-white'>
                Explore Restaurants
              </LinkButton>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-5'>
            {groups.map((group) => (
              <CartGroupCard
                key={group.restaurantId}
                group={group}
                isPending={isMutating}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}
      </div>

      <HomeFooter variant='detail' />
    </main>
  );
}

