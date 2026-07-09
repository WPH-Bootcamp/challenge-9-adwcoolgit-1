import { OrderHistoryPageSkeleton } from '@/components/shared/page-skeletons';

export default function ProfileLoading() {
  return (
    <main className='min-h-screen bg-(--color-neutral-50)'>
      <OrderHistoryPageSkeleton />
    </main>
  );
}