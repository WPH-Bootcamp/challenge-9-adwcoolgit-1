import type { ImageLoaderProps } from 'next/image';

export const homeHeroImageUrl = '/images/home-hero.png';

export const homeSearchIconUrl =
  'https://www.figma.com/api/mcp/asset/909fdcd2-5325-45f1-a766-273624a3fc3d';

export const homeCategoryIconUrls = {
  allRestaurant: '/images/all-restaurant.png',
  nearby: '/images/nearby.png',
  bestSeller: '/images/best-seller.png',
  lunch: '/images/lunch.png',
} as const;

export const passthroughLoader = ({ src }: ImageLoaderProps) => src;
