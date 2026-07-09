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

export function OrderHistoryCard({
  order,
  onGiveReview,
}: OrderHistoryCardProps) {
  const primaryRestaurant = order.restaurants[0];
  const primaryItem = primaryRestaurant?.items[0];

  if (!primaryRestaurant || !primaryItem) {
    return null;
  }

  return (
    <article className='flex min-h-[274px] w-full flex-col gap-4 rounded-[16px] bg-white p-4 shadow-[0_0_20px_rgba(203,202,202,0.25)] md:min-h-[268px] md:gap-4 md:p-5'>
      <div className='flex items-center gap-2'>
        <RestaurantMark
          name={primaryRestaurant.restaurantName}
          imageUrl={primaryRestaurant.restaurantLogo}
        />
        <p className='text-sm font-bold leading-7 tracking-tight text-neutral-950 md:text-lg md:leading-8 md:tracking-[-0.03em]'>
          {primaryRestaurant.restaurantName}
        </p>
      </div>

      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6'>
        <div className='flex min-w-0 flex-1 items-center gap-3 md:gap-[17px]'>
          <div className='relative size-16 shrink-0 overflow-hidden rounded-[12px] bg-neutral-100 md:size-20'>
            {primaryItem.imageUrl ? (
              <Image
                loader={passthroughLoader}
                unoptimized
                src={primaryItem.imageUrl}
                alt={primaryItem.name}
                fill
                sizes='(max-width: 767px) 64px, 80px'
                className='object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center px-2 text-center text-sm font-bold text-neutral-700'>
                {primaryItem.name}
              </div>
            )}
          </div>
          <div className='min-w-0 flex-1 text-neutral-950'>
            <p className='truncate text-sm font-medium leading-7 tracking-tight md:text-base md:leading-7.5 md:tracking-[-0.03em]'>
              {primaryItem.name}
            </p>
            <p className='text-base font-extrabold leading-7.5 md:text-base md:leading-7.5'>
              {formatCurrency(primaryItem.price)}
            </p>
          </div>
        </div>

        <div className='hidden h-22 w-[273.5px] shrink-0 md:block' />
      </div>

      <div className='h-px w-full bg-neutral-300' />

      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6'>
        <div className='text-neutral-950 md:w-55.75'>
          <p className='-mb-1 text-sm font-medium leading-7 tracking-tight md:text-base md:leading-7.5 md:tracking-[-0.03em]'>
            Total
          </p>
          <p className='text-base font-extrabold leading-7.5 md:text-xl md:leading-8.5'>
            {formatCurrency(order.total)}
          </p>
        </div>

        <Button
          type='button'
          variant='primary'
          onClick={() => onGiveReview(order)}
          className='h-11 w-full text-white! md:h-12 md:w-60'
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
      <div className='relative size-8 overflow-hidden rounded-2 bg-white'>
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
    <div className='flex size-8 items-center justify-center rounded-2 bg-(--color-primary) text-sm font-bold text-white'>
      {name.trim().charAt(0).toUpperCase() || 'F'}
    </div>
  );
}
