import { CheckoutPageSkeleton } from '@/components/shared/page-skeletons';

export default function CheckoutLoading() {
  return (
    <main className='min-h-screen bg-white'>
      <CheckoutPageSkeleton />
    </main>
  );
}