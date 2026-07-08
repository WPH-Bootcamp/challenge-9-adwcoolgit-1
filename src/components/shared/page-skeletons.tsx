import { Skeleton } from '@/components/shared/skeleton';

export function CartPageSkeleton() {
  return (
    <div className='mx-auto flex max-w-360 flex-col gap-8 px-4 py-8 sm:px-6 md:px-8 lg:px-30 lg:py-12'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-10 w-40 rounded-xl' />
          <Skeleton className='h-6 w-80 max-w-full rounded-xl' />
        </div>
        <Skeleton className='h-10 w-28 rounded-full' />
      </div>

      <CartContentSkeleton />
    </div>
  );
}

export function CartContentSkeleton() {
  return (
    <div className='flex flex-col gap-5'>
      <CartGroupCardSkeleton />
      <CartGroupCardSkeleton />
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className='mx-auto flex max-w-360 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-30 lg:py-12'>
      <Skeleton className='h-10 w-44 rounded-xl' />
      <CheckoutContentSkeleton />
    </div>
  );
}

export function CheckoutContentSkeleton() {
  return (
    <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start'>
      <div className='flex min-w-0 flex-col gap-5'>
        <section className='rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-8 rounded-full' />
              <Skeleton className='h-8 w-44 rounded-xl' />
            </div>
            <Skeleton className='h-24 w-full rounded-[12px]' />
            <Skeleton className='h-12 w-full rounded-[12px]' />
            <Skeleton className='h-24 w-full rounded-[12px]' />
            <Skeleton className='h-10 w-30 rounded-full' />
          </div>
        </section>

        <CartGroupCardSkeleton />
        <CartGroupCardSkeleton />
      </div>

      <aside className='overflow-hidden rounded-[16px] bg-white shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
        <div className='flex flex-col gap-4 p-5'>
          <Skeleton className='h-8 w-40 rounded-xl' />
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className='flex items-center gap-3 py-2'>
                <Skeleton className='size-10 rounded-lg' />
                <Skeleton className='h-7 flex-1 rounded-xl' />
                <Skeleton className='size-6 rounded-full' />
              </div>
            ))}
          </div>
        </div>
        <div className='border-t border-dashed border-neutral-300 px-5 py-4'>
          <div className='flex flex-col gap-4'>
            <Skeleton className='h-8 w-40 rounded-xl' />
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className='flex items-center justify-between gap-4'>
                <Skeleton className='h-6 w-32 rounded-xl' />
                <Skeleton className='h-6 w-24 rounded-xl' />
              </div>
            ))}
            <Skeleton className='h-12 w-full rounded-full' />
          </div>
        </div>
      </aside>
    </div>
  );
}

export function OrderHistoryPageSkeleton() {
  return (
    <div className='mx-auto flex max-w-300 flex-col gap-8 px-4 py-8 sm:px-6 md:px-8 lg:flex-row lg:items-start lg:gap-8 lg:px-0 lg:py-12'>
      <aside className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)] lg:w-60'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-12 rounded-full' />
            <Skeleton className='h-8 w-28 rounded-xl' />
          </div>
          <Skeleton className='h-px w-full rounded-none' />
          <div className='flex flex-col gap-4'>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className='flex items-center gap-2'>
                <Skeleton className='size-6 rounded-md' />
                <Skeleton className='h-7 w-32 rounded-xl' />
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className='min-w-0 flex-1'>
        <div className='flex flex-col gap-6'>
          <Skeleton className='h-10 w-44 rounded-xl' />
          <div className='rounded-[16px] bg-white p-6 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
            <OrderHistoryContentSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}

export function OrderHistoryContentSkeleton() {
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-5'>
        <Skeleton className='h-11 w-full max-w-149 rounded-full' />
        <div className='flex flex-wrap gap-3'>
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className='h-11 w-26 rounded-full' />
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        <OrderHistoryCardSkeleton />
        <OrderHistoryCardSkeleton />
      </div>
    </div>
  );
}

export function RestaurantDetailPageSkeleton() {
  return (
    <div className='flex flex-col gap-4 sm:gap-8'>
      <div className='flex flex-col gap-3 lg:hidden'>
        <Skeleton className='aspect-[361/260] w-full rounded-2xl' />
        <div className='flex justify-center gap-1.5'>
          <Skeleton className='size-2 rounded-full' />
          <Skeleton className='size-2 rounded-full' />
          <Skeleton className='size-2 rounded-full' />
        </div>
      </div>

      <div className='hidden lg:flex lg:flex-row lg:items-stretch lg:gap-5'>
        <Skeleton className='h-117.5 w-162.75 rounded-2xl' />
        <div className='flex flex-1 flex-col gap-5'>
          <Skeleton className='h-75.5 w-full rounded-2xl' />
          <div className='grid flex-1 grid-cols-2 gap-5'>
            <Skeleton className='min-h-35 rounded-2xl' />
            <Skeleton className='min-h-35 rounded-2xl' />
          </div>
        </div>
      </div>

      <div className='flex items-start justify-between gap-4 sm:items-center'>
        <div className='flex min-w-0 items-center gap-2 sm:gap-4'>
          <Skeleton className='size-22.5 rounded-full sm:size-30' />
          <div className='flex min-w-0 flex-1 flex-col gap-2'>
            <Skeleton className='h-8 w-52 max-w-full rounded-xl sm:h-10' />
            <Skeleton className='h-6 w-24 rounded-xl' />
            <Skeleton className='h-6 w-56 max-w-full rounded-xl' />
          </div>
        </div>
        <Skeleton className='size-11 rounded-full sm:h-11 sm:w-28' />
      </div>

      <div className='my-4 h-px w-full bg-neutral-300 sm:my-8' />

      <div className='flex flex-col gap-4 sm:gap-8'>
        <div className='flex flex-col gap-4 sm:gap-6'>
          <Skeleton className='h-9 w-28 rounded-xl sm:h-11 sm:w-32' />
          <div className='flex flex-wrap gap-2 sm:gap-3'>
            <Skeleton className='h-10 w-26 rounded-full' />
            <Skeleton className='h-10 w-22 rounded-full' />
            <Skeleton className='h-10 w-24 rounded-full' />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 8 }, (_, index) => (
            <MenuCardSkeleton key={index} />
          ))}
        </div>
      </div>

      <div className='my-4 h-px w-full bg-neutral-300 sm:my-8' />

      <div className='flex flex-col gap-4 sm:gap-8'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-9 w-32 rounded-xl sm:h-11 sm:w-36' />
          <Skeleton className='h-6 w-40 rounded-xl' />
        </div>
        <div className='grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2'>
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
        </div>
      </div>
    </div>
  );
}

function CartGroupCardSkeleton() {
  return (
    <section className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex items-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-8 w-40 rounded-xl' />
      </div>
      <div className='mt-5 flex flex-col gap-5'>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-[17px]'>
              <Skeleton className='size-20 rounded-[12px]' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-7 w-32 rounded-xl' />
                <Skeleton className='h-8 w-24 rounded-xl' />
              </div>
            </div>
            <div className='flex items-center justify-end gap-4 md:py-6'>
              <Skeleton className='size-9 rounded-full sm:size-10' />
              <Skeleton className='h-8 w-6 rounded-xl' />
              <Skeleton className='size-9 rounded-full sm:size-10' />
            </div>
          </div>
        ))}
      </div>
      <div className='mt-5 flex flex-col gap-4 border-t border-dashed border-neutral-300 pt-5 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-6 w-16 rounded-xl' />
          <Skeleton className='h-8 w-28 rounded-xl' />
        </div>
        <Skeleton className='h-12 w-full rounded-full sm:w-60' />
      </div>
    </section>
  );
}

function OrderHistoryCardSkeleton() {
  return (
    <article className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex items-center gap-2'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-8 w-40 rounded-xl' />
      </div>
      <div className='mt-4 flex items-center justify-between gap-4'>
        <div className='flex min-w-0 flex-1 items-center gap-[17px]'>
          <Skeleton className='size-20 rounded-[12px]' />
          <div className='flex min-w-0 flex-1 flex-col gap-2'>
            <Skeleton className='h-7 w-36 rounded-xl' />
            <Skeleton className='h-7 w-28 rounded-xl' />
          </div>
        </div>
      </div>
      <div className='my-4 h-px w-full bg-neutral-300' />
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-6 w-16 rounded-xl' />
          <Skeleton className='h-8 w-28 rounded-xl' />
        </div>
        <Skeleton className='h-12 w-full rounded-full sm:w-60' />
      </div>
    </article>
  );
}

function MenuCardSkeleton() {
  return (
    <div className='rounded-[16px] bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex flex-col gap-3'>
        <Skeleton className='aspect-square w-full rounded-[12px]' />
        <Skeleton className='h-7 w-full rounded-xl' />
        <Skeleton className='h-7 w-24 rounded-xl' />
        <Skeleton className='h-10 w-full rounded-full' />
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className='rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-12 rounded-full' />
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-7 w-28 rounded-xl' />
            <Skeleton className='h-5 w-24 rounded-xl' />
          </div>
        </div>
        <Skeleton className='h-6 w-32 rounded-xl' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-full rounded-xl' />
          <Skeleton className='h-5 w-[85%] rounded-xl' />
          <Skeleton className='h-5 w-[70%] rounded-xl' />
        </div>
      </div>
    </div>
  );
}
