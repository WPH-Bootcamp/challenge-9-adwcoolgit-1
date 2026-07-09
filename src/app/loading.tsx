import { Skeleton } from '@/components/shared/skeleton';

export default function AppLoading() {
  return (
    <main className='min-h-screen bg-(--color-neutral-50)'>
      <div className='mx-auto flex max-w-300 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-0 lg:py-12'>
        <div className='flex items-center justify-between gap-4'>
          <Skeleton className='h-10 w-36 rounded-xl' />
          <div className='flex items-center gap-3'>
            <Skeleton className='size-10 rounded-full' />
            <Skeleton className='h-10 w-28 rounded-full' />
          </div>
        </div>

        <Skeleton className='h-48 w-full rounded-[24px] sm:h-64 lg:h-80' />

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          <Skeleton className='h-72 rounded-[24px]' />
          <Skeleton className='h-72 rounded-[24px]' />
          <Skeleton className='h-72 rounded-[24px]' />
        </div>
      </div>
    </main>
  );
}