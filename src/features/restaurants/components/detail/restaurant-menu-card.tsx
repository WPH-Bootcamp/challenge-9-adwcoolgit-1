import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { IconButton } from '@/components/shared/icon-button';
import { passthroughLoader } from '@/features/home/constants';
import type { MenuItem } from '@/types/domain';

interface RestaurantMenuCardProps {
  menu: MenuItem;
  quantity: number;
  isPending: boolean;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function RestaurantMenuCard({
  menu,
  quantity,
  isPending,
  onAdd,
  onIncrement,
  onDecrement,
}: RestaurantMenuCardProps) {
  return (
    <article className='flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='relative aspect-square w-full overflow-hidden rounded-t-2xl bg-neutral-100'>
        {menu.imageUrl ? (
          <Image
            loader={passthroughLoader}
            unoptimized
            src={menu.imageUrl}
            alt={menu.name}
            fill
            sizes='(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw'
            className='object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center px-4 text-center text-lg font-bold text-neutral-700'>
            {menu.name}
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col justify-between gap-4 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4'>
        <div className='min-w-0 flex-1 text-neutral-950)'>
          <p className='truncate text-sm font-medium leading-7 tracking-tight sm:text-base sm:leading-7.5'>
            {menu.name}
          </p>
          <p className='text-md font-extrabold leading-7.5 tracking-tight sm:text-lg sm:leading-8'>
            {formatCurrency(menu.price)}
          </p>
        </div>

        {quantity > 0 ? (
          <div className='flex items-center gap-4 sm:shrink-0'>
            <IconButton
              type='button'
              onClick={onDecrement}
              disabled={isPending}
              aria-label={`Decrease ${menu.name} quantity`}
            >
              <Minus className='size-5 sm:size-6' strokeWidth={1.75} />
            </IconButton>
            <span className='min-w-3 text-center text-md font-semibold leading-7.5 tracking-tight text-neutral-950 sm:text-lg sm:leading-8'>
              {quantity}
            </span>
            <IconButton
              type='button'
              variant='primary'
              onClick={onIncrement}
              disabled={isPending}
              aria-label={`Increase ${menu.name} quantity`}
            >
              <Plus className='size-5 sm:size-6' strokeWidth={1.75} />
            </IconButton>
          </div>
        ) : (
          <Button
            type='button'
            variant='primary'
            onClick={onAdd}
            disabled={isPending}
            className='h-9 w-full px-2 text-sm leading-7 sm:h-10 sm:w-19.75 sm:shrink-0 sm:text-base sm:leading-7.5'
          >
            Add
          </Button>
        )}
      </div>
    </article>
  );
}
