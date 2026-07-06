import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { passthroughLoader } from '@/features/home/constants';
import type { RestaurantCard } from '@/types/domain';

interface HomeRestaurantCardProps {
  restaurant: RestaurantCard;
}

function formatDistance(distance: number | null) {
  if (distance === null) {
    return null;
  }

  return `${distance.toFixed(1)} km`;
}

export function HomeRestaurantCard({ restaurant }: HomeRestaurantCardProps) {
  const image = restaurant.imageUrl ?? restaurant.galleryImages[0] ?? null;
  const distance = formatDistance(restaurant.distance);

  return (
    <Link
      href={`/resto/${restaurant.id}`}
      className='flex min-w-0 items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)] transition-transform duration-200 hover:-translate-y-0.5'
    >
      <div className='relative size-30 flex-none overflow-hidden rounded-xl bg-(--color-neutral-25)'>
        {image ? (
          <Image
            loader={passthroughLoader}
            unoptimized
            src={image}
            alt={restaurant.name}
            fill
            sizes='120px'
            className='object-contain p-3'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center px-3 text-center text-base font-extrabold leading-6 tracking-tight text-(--color-neutral-950)'>
            {restaurant.name}
          </div>
        )}
      </div>
      <div className='flex min-w-0 flex-1 flex-col items-start gap-0.5'>
        <h3 className='w-full truncate text-lg font-extrabold leading-8 tracking-tight text-neutral-950'>
          {restaurant.name}
        </h3>
        <div className='flex items-center gap-1'>
          <Star
            className='size-6 fill-[#FDB022] text-[#FDB022]'
            strokeWidth={1.5}
          />
          <span className='text-base font-medium leading-7.5 tracking-tight text-(--color-neutral-950)'>
            {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}
          </span>
        </div>
        <div className='flex min-w-0 flex-wrap items-center gap-1.5 text-base font-normal leading-7.5 tracking-tight text-neutral-950'>
          <span className='truncate'>
            {restaurant.location ?? 'Location unavailable'}
          </span>
          {distance ? (
            <>
              <span className='h-0.5 w-0.5 rounded-full bg-(--color-neutral-950)' />
              <span className='whitespace-nowrap'>{distance}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
