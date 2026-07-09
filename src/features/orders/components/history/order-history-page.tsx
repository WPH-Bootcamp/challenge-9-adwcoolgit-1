'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import {
  OrderHistoryContentSkeleton,
  OrderHistoryPageSkeleton,
} from '@/components/shared/page-skeletons';
import { useSessionState } from '@/features/auth/hooks';
import { useCartQuery } from '@/features/cart/hooks';
import { HomeFooter } from '@/features/home/components/home-footer';
import {
  useOrderHistory,
  type OrderHistoryFilter,
} from '@/features/orders/hooks';
import { RestaurantDetailHeader } from '@/features/restaurants/components/detail/restaurant-detail-header';
import type { OrderRecord } from '@/types/domain';

import { OrderHistoryCard } from './order-history-card';
import { OrderHistorySidebar } from './order-history-sidebar';
import { OrderHistoryToolbar } from './order-history-toolbar';
import { OrderReviewModal } from './order-review-modal';

export function OrderHistoryPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useSessionState();
  const cartQuery = useCartQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderHistoryFilter>('done');
  const [reviewOrder, setReviewOrder] = useState<OrderRecord | null>(null);
  const orderHistoryQuery = useOrderHistory(activeFilter, searchQuery);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const cartCount = cartQuery.data?.summary.totalItems ?? 0;

  if (!hasHydrated || (!isAuthenticated && !orderHistoryQuery.data)) {
    return (
      <main className='min-h-screen bg-(--color-neutral-50)'>
        <OrderHistoryPageSkeleton />
      </main>
    );
  }

  return (
    <>
      <main className='min-h-screen bg-(--color-neutral-50)'>
        <RestaurantDetailHeader
          isAuthenticated={isAuthenticated}
          user={user}
          cartCount={cartCount}
        />

        <div className='mx-auto flex w-full max-w-90.25 flex-col gap-4 pt-4 sm:max-w-300 sm:gap-6 sm:px-6 sm:pt-8 md:flex-row md:items-start md:px-8 md:pt-10 lg:gap-8 lg:px-0 lg:pt-12 pb-12 md:pb-25'>
          <div className='hidden md:block'>
            <OrderHistorySidebar user={user} />
          </div>

          <section className='min-w-0 w-full flex-1'>
            <div className='flex flex-col gap-4 sm:gap-6'>
              <h1 className='text-display-xs font-extrabold leading-9 text-neutral-950 sm:text-display-md sm:leading-10.5'>
                My Orders
              </h1>

              <div className='w-full rounded-[16px] bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)] sm:p-6'>
                <div className='flex flex-col gap-5'>
                  <OrderHistoryToolbar
                    value={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />

                  {orderHistoryQuery.isLoading ? (
                    <OrderHistoryContentSkeleton />
                  ) : orderHistoryQuery.isError ? (
                    <ErrorState
                      title='Unable to load your orders'
                      description='We could not load your order history right now. Please try again in a moment.'
                      action={
                        <Button
                          type='button'
                          variant='primary'
                          className='!text-white'
                          onClick={() => void orderHistoryQuery.refetch()}
                        >
                          Try Again
                        </Button>
                      }
                    />
                  ) : orderHistoryQuery.filteredOrders.length === 0 ? (
                    <EmptyState
                      title='No orders found'
                      description='Try another status or search term to find matching orders.'
                    />
                  ) : (
                    <div className='flex w-full flex-col gap-4 sm:gap-5'>
                      {orderHistoryQuery.filteredOrders.map((order) => (
                        <OrderHistoryCard
                          key={order.id}
                          order={order}
                          onGiveReview={setReviewOrder}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <HomeFooter variant='detail' />
      </main>

      {reviewOrder ? (
        <OrderReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
        />
      ) : null}
    </>
  );
}
