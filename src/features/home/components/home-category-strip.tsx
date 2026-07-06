import Image from 'next/image';

import {
  homeCategoryIconUrls,
  passthroughLoader,
} from '@/features/home/constants';

const categories = [
  {
    key: 'all',
    label: 'All Restaurant',
    icon: homeCategoryIconUrls.allRestaurant,
  },
  {
    key: 'nearby',
    label: 'Nearby',
    icon: homeCategoryIconUrls.nearby,
  },
  {
    key: 'best',
    label: 'Best Seller',
    icon: homeCategoryIconUrls.bestSeller,
  },
  {
    key: 'lunch',
    label: 'Lunch',
    icon: homeCategoryIconUrls.lunch,
  },
] as const;

export function HomeCategoryStrip() {
  return (
    <section className='mx-auto w-full max-w-300 px-6 lg:px-0'>
      <div className='grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 lg:grid-cols-[repeat(4,161px)] lg:justify-between lg:gap-y-0'>
        {categories.map((category) => (
          <div
            key={category.key}
            className='flex w-full flex-col items-center justify-center gap-1.5 lg:w-40.25'
          >
            <div className='flex h-25 w-full items-center justify-center rounded-2xl bg-white p-2 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
              <div className='relative h-16.25 w-16.25'>
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={category.icon}
                  alt={category.label}
                  fill
                  sizes='65px'
                  className='object-contain'
                />
              </div>
            </div>
            <p className='w-full text-center text-lg font-bold leading-8 tracking-[-0.03em] text-(--color-neutral-950)'>
              {category.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
