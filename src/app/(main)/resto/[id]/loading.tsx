import { RestaurantDetailPageSkeleton } from '@/components/shared/page-skeletons';

export default function RestaurantDetailLoading() {
  return (
    <main className='min-h-screen bg-white'>
      <div className='mx-auto max-w-360 px-4 py-4 sm:px-6 sm:py-8 md:px-8 lg:px-0 lg:py-12'>
        <RestaurantDetailPageSkeleton />
      </div>
    </main>
  );
}