import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Minus, Plus } from 'lucide-react';

import { LinkButton } from '@/components/shared/button';
import { IconButton } from '@/components/shared/icon-button';
import { passthroughLoader } from '@/features/home/constants';
import type { BasketGroup, BasketItem } from '@/types/domain';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

interface CartGroupCardProps {
  group: BasketGroup;
  isPending?: boolean;
  onQuantityChange: (item: BasketItem, targetQuantity: number) => void;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function CartGroupCard({
  group,
  isPending = false,
  onQuantityChange,
}: CartGroupCardProps) {
  return (
    <section className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <Link
        href={`/resto/${group.restaurantId}`}
        className='inline-flex items-center gap-2 text-neutral-950'
      >
        <RestaurantMark
          name={group.restaurantName}
          imageUrl={group.restaurantLogo}
        />
        <span className='text-lg font-bold leading-8 tracking-tight'>
          {group.restaurantName}
        </span>
        <ChevronRight className='size-5' strokeWidth={2} />
      </Link>

      <div className='mt-5 flex flex-col gap-5'>
        {group.items.map((item) => (
          <article
            key={item.id}
            className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'
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

            <div className='flex items-center justify-end gap-4 md:py-6'>
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

      <div className='mt-5 flex flex-col gap-4 border-t border-dashed border-neutral-300 pt-5 sm:flex-row sm:items-end sm:justify-between'>
        <div className='text-neutral-950'>
          <p className='text-base font-medium leading-7.5 tracking-tight'>Total</p>
          <p className='text-xl font-extrabold leading-8.5'>
            {formatCurrency(group.subtotal)}
          </p>
        </div>

        <LinkButton
          href='/checkout'
          variant='primary'
          className='h-12 w-full !text-white sm:w-60'
        >
          Checkout
        </LinkButton>
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

