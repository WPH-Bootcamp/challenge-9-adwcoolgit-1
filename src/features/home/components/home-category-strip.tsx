import Image from 'next/image';

import {
  homeCategoryIconUrls,
  passthroughLoader,
} from '@/features/home/constants';

export type HomeCategoryKey = 'all' | 'nearby' | 'bestSeller' | 'lunch';

interface HomeCategoryStripProps {
  activeCategory: HomeCategoryKey;
  onSelect: (category: HomeCategoryKey) => void;
}

const categories: Array<{
  key: HomeCategoryKey;
  label: string;
  icon: string;
}> = [
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
    key: 'bestSeller',
    label: 'Best Seller',
    icon: homeCategoryIconUrls.bestSeller,
  },
  {
    key: 'lunch',
    label: 'Lunch',
    icon: homeCategoryIconUrls.lunch,
  },
];

export function HomeCategoryStrip({
  activeCategory,
  onSelect,
}: HomeCategoryStripProps) {
  return (
    <section className='mx-auto w-full max-w-300 px-6 lg:px-0'>
      <div className='grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 lg:grid-cols-[repeat(4,161px)] lg:justify-between lg:gap-y-0'>
        {categories.map((category) => {
          const isActive = activeCategory === category.key;

          return (
            <button
              key={category.key}
              type='button'
              onClick={() => onSelect(category.key)}
              aria-pressed={isActive}
              className='flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 text-left lg:w-40.25'
            >
              <div
                className={`flex h-25 w-full items-center justify-center rounded-2xl p-2 shadow-[0_0_10px_rgba(203,202,202,0.25)] transition-colors ${
                  isActive
                    ? 'bg-(--color-primary-500)'
                    : 'bg-white'
                }`}
              >
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
              <p
                className={`w-full text-center text-lg font-bold leading-8 tracking-[-0.03em] ${
                  isActive
                    ? 'text-(--color-primary-500)'
                    : 'text-(--color-neutral-950)'
                }`}
              >
                {category.label}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
