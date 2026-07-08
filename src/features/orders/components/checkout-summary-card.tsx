'use client';

import Image from 'next/image';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/shared/button';
import {
  paymentMethodOptions,
  type CheckoutFormValues,
} from '@/lib/validations/checkout';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const bankLogoByLabel = {
  'Bank Negara Indonesia': '/images/bni-logo.svg',
  'Bank Rakyat Indonesia': '/images/bri-logo.svg',
  'Bank Central Asia': '/images/bca-logo.svg',
  Mandiri: '/images/mandiri-logo.svg',
} as const;

interface CheckoutPaymentCardProps {
  form: UseFormReturn<CheckoutFormValues>;
  totalItems: number;
  basketTotal: number;
  deliveryFee: number;
  serviceFee: number;
  grandTotal: number;
  isSubmitting: boolean;
  submitError: string | null;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function CheckoutPaymentCard({
  form,
  totalItems,
  basketTotal,
  deliveryFee,
  serviceFee,
  grandTotal,
  isSubmitting,
  submitError,
}: CheckoutPaymentCardProps) {
  return (
    <aside className='overflow-hidden rounded-[16px] bg-white shadow-[0_0_10px_rgba(203,202,202,0.25)] lg:sticky lg:top-8'>
      <div className='flex flex-col gap-4 p-5'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-extrabold leading-8 tracking-tight text-neutral-950'>
            Payment Method
          </h2>

          <Controller
            control={form.control}
            name='paymentMethod'
            render={({ field }) => (
              <div className='flex flex-col'>
                {paymentMethodOptions.map((option, index) => {
                  const isActive = field.value === option;

                  return (
                    <button
                      key={option}
                      type='button'
                      onClick={() => field.onChange(option)}
                      className={`flex w-full items-center gap-2 py-3 text-left ${index > 0 ? 'border-t border-neutral-200' : ''} cursor-pointer`}
                    >
                      <BankMark label={option} />
                      <span className='min-w-0 flex-1 text-base font-normal leading-7.5 tracking-tight text-neutral-950'>
                        {option}
                      </span>
                      <span
                        className={`relative size-6 rounded-full ${isActive ? 'bg-(--color-primary)' : 'border border-neutral-400 bg-white'}`}
                      >
                        {isActive ? (
                          <span className='absolute inset-[30%] rounded-full bg-white' />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>

      <div className='border-t border-dashed border-neutral-300 px-5 py-4'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-extrabold leading-8 tracking-tight text-neutral-950'>
            Payment Summary
          </h2>

          <div className='flex items-center justify-between gap-4 text-base leading-7.5 text-neutral-950'>
            <p className='font-medium tracking-tight'>
              Price ({totalItems} items)
            </p>
            <p className='font-bold tracking-tight'>
              {formatCurrency(basketTotal)}
            </p>
          </div>
          <div className='flex items-center justify-between gap-4 text-base leading-7.5 text-neutral-950'>
            <p className='font-medium tracking-tight'>Delivery Fee</p>
            <p className='font-bold tracking-tight'>
              {formatCurrency(deliveryFee)}
            </p>
          </div>
          <div className='flex items-center justify-between gap-4 text-base leading-7.5 text-neutral-950'>
            <p className='font-medium tracking-tight'>Service Fee</p>
            <p className='font-bold tracking-tight'>
              {formatCurrency(serviceFee)}
            </p>
          </div>
          <div className='flex items-center justify-between gap-4 text-lg leading-8 text-neutral-950'>
            <p className='font-normal'>Total</p>
            <p className='font-extrabold tracking-tight'>
              {formatCurrency(grandTotal)}
            </p>
          </div>

          {submitError ? (
            <div className='rounded-xl border border-[rgba(193,33,22,0.18)] bg-[rgba(193,33,22,0.06)] px-4 py-3 text-sm font-medium leading-5 tracking-tight text-(--color-primary)'>
              {submitError}
            </div>
          ) : null}

          <Button
            type='submit'
            variant='primary'
            size='full'
            disabled={isSubmitting}
            className='text-white'
          >
            {isSubmitting ? 'Processing...' : 'Buy'}
          </Button>
        </div>
      </div>
    </aside>
  );
}

function BankMark({ label }: { label: keyof typeof bankLogoByLabel }) {
  return (
    <div className='flex size-10 items-center justify-center overflow-hidden rounded-lg border border-neutral-300 bg-white p-1.5'>
      <Image
        src={bankLogoByLabel[label]}
        alt={label}
        width={28}
        height={28}
        className='h-auto w-full object-contain'
      />
    </div>
  );
}
