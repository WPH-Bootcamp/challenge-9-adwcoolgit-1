import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';

import { IconButton } from '@/components/shared/icon-button';
import { LinkButton } from '@/components/shared/button';
import { passthroughLoader } from '@/features/home/constants';
import type { BasketGroup, BasketItem } from '@/types/domain';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

interface CheckoutCartGroupCardProps {
  group: BasketGroup;
  isPending?: boolean;
  onQuantityChange: (item: BasketItem, targetQuantity: number) => void;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function CheckoutCartGroupCard({
  group,
  isPending = false,
  onQuantityChange,
}: CheckoutCartGroupCardProps) {
  return (
    <section className='rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <RestaurantMark name={group.restaurantName} imageUrl={group.restaurantLogo} />
          <h2 className='text-lg font-bold leading-8 tracking-tight text-neutral-950'>
            {group.restaurantName}
          </h2>
        </div>

        <LinkButton
          href={`/resto/${group.restaurantId}`}
          variant='neutralOutline'
          className='h-10 w-30 text-base font-bold'
        >
          Add item
        </LinkButton>
      </div>

      <div className='mt-5 flex flex-col gap-5'>
        {group.items.map((item) => (
          <article
            key={item.id}
            className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
          >
            <div className='flex items-center gap-[17px]'>
              <div className='relative size-20 overflow-hidden rounded-[12px] bg-neutral-100'>
                {item.imageUrl ? (
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center px-2 text-center text-sm font-bold text-neutral-700'>
                    {item.name}
                  </div>
                )}
              </div>
              <div className='min-w-0 text-neutral-950'>
                <p className='truncate text-base font-medium leading-7.5 tracking-tight'>
                  {item.name}
                </p>
                <p className='text-lg font-extrabold leading-8 tracking-tight'>
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>
            </div>

            <div className='flex items-center justify-end gap-4 sm:py-6'>
              <IconButton
                type='button'
                disabled={isPending}
                onClick={() => onQuantityChange(item, item.quantity - 1)}
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus className='size-5 sm:size-6' strokeWidth={1.75} />
              </IconButton>
              <span className='min-w-5 text-center text-lg font-semibold leading-8 tracking-tight text-neutral-950'>
                {item.quantity}
              </span>
              <IconButton
                type='button'
                variant='primary'
                disabled={isPending}
                onClick={() => onQuantityChange(item, item.quantity + 1)}
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus className='size-5 sm:size-6' strokeWidth={1.75} />
              </IconButton>
            </div>
          </article>
        ))}
      </div>
    </section>
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

  const fallback = name.trim().charAt(0).toUpperCase() || 'F';

  return (
    <div className='flex size-8 items-center justify-center rounded-full bg-(--color-primary) text-sm font-bold text-white'>
      {fallback}
    </div>
  );
}
