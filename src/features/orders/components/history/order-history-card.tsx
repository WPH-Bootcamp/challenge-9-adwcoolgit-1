import Image from 'next/image';

import { Button } from '@/components/shared/button';
import { passthroughLoader } from '@/features/home/constants';
import type { OrderRecord } from '@/types/domain';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

interface OrderHistoryCardProps {
  order: OrderRecord;
  onGiveReview: (order: OrderRecord) => void;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function OrderHistoryCard({ order, onGiveReview }: OrderHistoryCardProps) {
  const primaryRestaurant = order.restaurants[0];
  const primaryItem = primaryRestaurant?.items[0];

  if (!primaryRestaurant || !primaryItem) {
    return null;
  }

  return (
    <article className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex items-center gap-2'>
        <RestaurantMark
          name={primaryRestaurant.restaurantName}
          imageUrl={primaryRestaurant.restaurantLogo}
        />
        <p className='text-lg font-bold leading-8 tracking-tight text-neutral-950'>
          {primaryRestaurant.restaurantName}
        </p>
      </div>

      <div className='mt-4 flex items-center justify-between gap-4'>
        <div className='flex min-w-0 flex-1 items-center gap-[17px]'>
          <div className='relative size-20 overflow-hidden rounded-[12px] bg-neutral-100'>
            {primaryItem.imageUrl ? (
              <Image
                loader={passthroughLoader}
                unoptimized
                src={primaryItem.imageUrl}
                alt={primaryItem.name}
                fill
                sizes='80px'
                className='object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center px-2 text-center text-sm font-bold text-neutral-700'>
                {primaryItem.name}
              </div>
            )}
          </div>
          <div className='min-w-0 flex-1 text-neutral-950'>
            <p className='truncate text-base font-medium leading-7.5 tracking-tight'>
              {primaryItem.name}
            </p>
            <p className='text-base font-extrabold leading-7.5'>
              {primaryItem.quantity} x {formatCurrency(primaryItem.price)}
            </p>
          </div>
        </div>
        <div className='hidden h-[88px] w-[273.5px] shrink-0 md:block' />
      </div>

      <div className='my-4 h-px w-full bg-neutral-300' />

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='w-[223px] text-neutral-950'>
          <p className='mb-[-4px] text-base font-medium leading-7.5 tracking-tight'>
            Total
          </p>
          <p className='text-xl font-extrabold leading-8.5'>
            {formatCurrency(order.total)}
          </p>
        </div>

        <Button
          type='button'
          variant='primary'
          onClick={() => onGiveReview(order)}
          className='h-12 w-full !text-white sm:w-60'
        >
          Give Review
        </Button>
      </div>
    </article>
  );
}

function RestaurantMark({
  name,
  imageUrl,
}: {
  name: string;
  imageUrl: string | null;
}) {
  if (imageUrl) {
    return (
      <div className='relative size-8 overflow-hidden rounded-full'>
        <Image
          loader={passthroughLoader}
          unoptimized
          src={imageUrl}
          alt={name}
          fill
          sizes='32px'
          className='object-cover'
        />
      </div>
    );
  }

  return (
    <div className='flex size-8 items-center justify-center rounded-full bg-(--color-primary) text-sm font-bold text-white'>
      {name.trim().charAt(0).toUpperCase() || 'F'}
    </div>
  );
}
