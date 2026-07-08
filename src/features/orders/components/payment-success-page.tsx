'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

import { LinkButton } from '@/components/shared/button';
import { FoodyLogo } from '@/components/shared/foody-logo';
import { useSessionState } from '@/features/auth/hooks';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatPaymentDate(value: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return dateFormatter.format(date).replace(' at ', ', ');
}

function toNumber(value: string | null) {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasHydrated, isAuthenticated } = useSessionState();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (hasHydrated && isAuthenticated) {
      const hasRequiredParams =
        !!searchParams.get('createdAt') && !!searchParams.get('paymentMethod');

      if (!hasRequiredParams) {
        router.replace('/orders');
      }
    }
  }, [hasHydrated, isAuthenticated, router, searchParams]);

  const createdAt = searchParams.get('createdAt');
  const paymentMethod = searchParams.get('paymentMethod') ?? '-';
  const totalItems = toNumber(searchParams.get('items'));
  const subtotal = toNumber(searchParams.get('subtotal'));
  const deliveryFee = toNumber(searchParams.get('deliveryFee'));
  const serviceFee = toNumber(searchParams.get('serviceFee'));
  const total = toNumber(searchParams.get('total'));

  if (!hasHydrated || !isAuthenticated) {
    return <main className='min-h-screen bg-(--color-neutral-50)' />;
  }

  return (
    <main className='min-h-screen bg-(--color-neutral-50) px-4 py-8 sm:px-6 md:px-8 lg:py-12'>
      <div className='mx-auto flex w-full max-w-[398px] flex-col items-center gap-7'>
        <Link href='/' aria-label='Foody home' className='cursor-pointer'>
          <FoodyLogo
            surface='light'
            mark='red'
            textTone='brand'
            className='gap-[15px]'
          />
        </Link>

        <section className='relative w-full overflow-hidden rounded-[16px] bg-white px-5 py-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
          <TicketNotch top='156px' side='left' />
          <TicketNotch top='156px' side='right' />
          <TicketNotch top='402px' side='left' />
          <TicketNotch top='402px' side='right' />

          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-col items-center gap-0.5'>
              <div className='flex size-16 items-center justify-center rounded-full bg-[#38b000] text-white'>
                <Check className='size-9' strokeWidth={4} />
              </div>
              <h1 className='text-center text-xl font-extrabold leading-8.5 text-neutral-950'>
                Payment Success
              </h1>
              <p className='text-center text-base font-normal leading-7.5 tracking-tight text-neutral-950'>
                Your payment has been successfully processed.
              </p>
            </div>

            <div className='w-full border-t border-dashed border-neutral-300' />

            <div className='flex w-full flex-col gap-4'>
              <DetailRow label='Date' value={formatPaymentDate(createdAt)} />
              <DetailRow label='Payment Method' value={paymentMethod} />
              <DetailRow label={`Price (${totalItems} items)`} value={formatCurrency(subtotal)} />
              <DetailRow label='Delivery Fee' value={formatCurrency(deliveryFee)} />
              <DetailRow label='Service Fee' value={formatCurrency(serviceFee)} />
            </div>

            <div className='w-full border-t border-dashed border-neutral-300' />

            <div className='flex w-full items-center justify-between gap-4 text-neutral-950'>
              <p className='text-lg font-normal leading-8'>Total</p>
              <p className='text-lg font-extrabold leading-8 tracking-tight'>
                {formatCurrency(total)}
              </p>
            </div>

            <LinkButton
              href='/orders'
              variant='primary'
              size='full'
              className='h-12 !text-white'
            >
              See My Orders
            </LinkButton>
          </div>
        </section>
      </div>
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between gap-4 text-base leading-7.5 text-neutral-950'>
      <p className='min-w-0 font-medium tracking-tight'>{label}</p>
      <p className='text-right font-bold tracking-tight'>{value}</p>
    </div>
  );
}

function TicketNotch({ top, side }: { top: string; side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden='true'
      className={`absolute ${side === 'left' ? '-left-[10px]' : '-right-[10px]'} h-5 w-5 rounded-full bg-(--color-neutral-50)`}
      style={{ top }}
    />
  );
}
