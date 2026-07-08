'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PaginationDotButton } from '@/components/shared/pagination-dot-button';
import { passthroughLoader } from '@/features/home/constants';

interface RestaurantImageGalleryProps {
  images: string[];
  restaurantName: string;
}

function GalleryTile({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <div className={className}>
      {src ? (
        <Image
          loader={passthroughLoader}
          unoptimized
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes='(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw'
          className='object-cover'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-neutral-100 px-6 text-center text-lg font-bold text-neutral-700'>
          {alt}
        </div>
      )}
    </div>
  );
}

export function RestaurantImageGallery({
  images,
  restaurantName,
}: RestaurantImageGalleryProps) {
  const galleryImages: Array<string | null> =
    images.length > 0 ? images : [null];
  const [mobileIndex, setMobileIndex] = useState(0);
  const activeMobileIndex = Math.min(mobileIndex, galleryImages.length - 1);

  const primaryImage = galleryImages[0] ?? null;
  const secondaryImage = galleryImages[1] ?? primaryImage;
  const tertiaryImage = galleryImages[2] ?? primaryImage;
  const quaternaryImage = galleryImages[3] ?? secondaryImage ?? primaryImage;
  const mobileImage = galleryImages[activeMobileIndex] ?? primaryImage;
  const mobileDotCount = Math.max(1, Math.min(galleryImages.length, 4));

  return (
    <>
      <div className='flex flex-col gap-3 lg:hidden'>
        <GalleryTile
          src={mobileImage}
          alt={`${restaurantName} gallery image ${activeMobileIndex + 1}`}
          className='relative aspect-[361/260] w-full overflow-hidden rounded-2xl'
          priority={activeMobileIndex === 0}
        />
        {mobileDotCount > 1 ? (
          <div className='flex items-center justify-center gap-1.5'>
            {Array.from({ length: mobileDotCount }, (_, index) => (
              <PaginationDotButton
                key={`${restaurantName}-gallery-dot-${index}`}
                type='button'
                active={index === activeMobileIndex}
                aria-label={`Show gallery image ${index + 1}`}
                aria-pressed={index === activeMobileIndex}
                onClick={() => setMobileIndex(index)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className='hidden lg:flex lg:flex-row lg:items-stretch lg:gap-5'>
        <GalleryTile
          src={primaryImage}
          alt={`${restaurantName} main gallery`}
          className='relative h-64 overflow-hidden rounded-2xl sm:h-80 lg:h-117.5 lg:w-162.75'
          priority
        />
        <div className='flex flex-1 flex-col gap-3 sm:gap-4 md:gap-5'>
          <GalleryTile
            src={secondaryImage}
            alt={`${restaurantName} gallery image 2`}
            className='relative h-40 overflow-hidden rounded-2xl sm:h-55 lg:h-75.5'
          />
          <div className='grid flex-1 grid-cols-2 gap-3 sm:gap-4 md:gap-5'>
            <GalleryTile
              src={tertiaryImage}
              alt={`${restaurantName} gallery image 3`}
              className='relative min-h-28 overflow-hidden rounded-2xl sm:min-h-35'
            />
            <GalleryTile
              src={quaternaryImage}
              alt={`${restaurantName} gallery image 4`}
              className='relative min-h-28 overflow-hidden rounded-2xl sm:min-h-35'
            />
          </div>
        </div>
      </div>
    </>
  );
}
