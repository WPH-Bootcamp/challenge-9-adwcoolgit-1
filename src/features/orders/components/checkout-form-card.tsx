'use client';

import type { UseFormReturn } from 'react-hook-form';
import { MapPin } from 'lucide-react';

import { Button } from '@/components/shared/button';
import { FieldError } from '@/features/auth/components/auth-field';
import type { CheckoutFormValues } from '@/lib/validations/checkout';

interface CheckoutAddressCardProps {
  form: UseFormReturn<CheckoutFormValues>;
  isEditing: boolean;
  onToggleEditing: () => void;
}

const inputClassName =
  'w-full rounded-[10px] border border-neutral-300 bg-white px-4 py-3 text-base font-medium leading-7.5 tracking-tight text-neutral-950 outline-none placeholder:text-neutral-400';

export function CheckoutAddressCard({
  form,
  isEditing,
  onToggleEditing,
}: CheckoutAddressCardProps) {
  const {
    formState: { errors },
    register,
    watch,
  } = form;

  const deliveryAddress = watch('deliveryAddress');
  const phone = watch('phone');

  return (
    <section className='rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
      <div className='flex flex-col gap-[21px]'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <div className='flex size-8 items-center justify-center rounded-full bg-[linear-gradient(180deg,#FDB022_0%,#C12116_100%)] text-white'>
              <MapPin className='size-5' strokeWidth={2.25} />
            </div>
            <h2 className='text-lg font-extrabold leading-8 tracking-tight text-neutral-950'>
              Delivery Address
            </h2>
          </div>

          {isEditing ? (
            <div className='mt-2 flex flex-col gap-3'>
              <div className='flex flex-col gap-2'>
                <textarea
                  rows={3}
                  placeholder='Enter your full delivery address'
                  className={`${inputClassName} min-h-28 resize-none`}
                  {...register('deliveryAddress')}
                />
                <FieldError message={errors.deliveryAddress?.message} />
              </div>
              <div className='flex flex-col gap-2'>
                <input
                  type='tel'
                  placeholder='Phone number'
                  className={inputClassName}
                  {...register('phone')}
                />
                <FieldError message={errors.phone?.message} />
              </div>
              <div className='flex flex-col gap-2'>
                <textarea
                  rows={3}
                  placeholder='Order notes (optional)'
                  className={`${inputClassName} min-h-24 resize-none`}
                  {...register('notes')}
                />
                <FieldError message={errors.notes?.message} />
              </div>
            </div>
          ) : (
            <div className='mt-1 flex flex-col gap-0 text-base font-medium leading-7.5 tracking-tight text-neutral-950'>
              <p>{deliveryAddress}</p>
              <p>{phone || '-'}</p>
            </div>
          )}
        </div>

        <Button
          type='button'
          variant='neutralOutline'
          className='h-10 w-30 text-base font-bold'
          onClick={onToggleEditing}
        >
          {isEditing ? 'Done' : 'Change'}
        </Button>
      </div>
    </section>
  );
}
