import type { ImageLoaderProps } from 'next/image';

export const homeHeroImageUrl = '/images/home-hero.png';

export const homeSearchIconUrl = '/images/search-icon.svg';

export const homeCategoryIconUrls = {
  allRestaurant: '/images/all-restaurant.png',
  nearby: '/images/nearby.png',
  bestSeller: '/images/best-seller.png',
  lunch: '/images/lunch.png',
} as const;

export const passthroughLoader = ({ src }: ImageLoaderProps) => src;
