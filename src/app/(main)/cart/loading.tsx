import { CartPageSkeleton } from '@/components/shared/page-skeletons';

export default function CartLoading() {
  return (
    <main className='min-h-screen bg-white'>
      <CartPageSkeleton />
    </main>
  );
}