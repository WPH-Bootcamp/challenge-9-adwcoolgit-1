'use client';

import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/shared/button';
import { useCreateReviewMutation } from '@/features/orders/hooks';
import { cn } from '@/lib/utils';
import type { OrderRecord } from '@/types/domain';

interface OrderReviewModalProps {
  order: OrderRecord;
  onClose: () => void;
}

export function OrderReviewModal({ order, onClose }: OrderReviewModalProps) {
  const reviewMutation = useCreateReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const primaryRestaurant = order.restaurants[0];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !reviewMutation.isPending) {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, reviewMutation.isPending]);

  if (!primaryRestaurant) {
    return null;
  }

  async function handleSubmit() {
    if (rating <= 0) {
      toast.error('Please choose a rating before sending your review.');
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        transactionId: order.transactionId,
        restaurantId: primaryRestaurant.restaurantId,
        star: rating,
        comment: comment.trim() || undefined,
        menuIds: primaryRestaurant.items.map((item) => item.menuId),
      });
      toast.success('Review sent successfully.');
      onClose();
    } catch {
      toast.error('Unable to send your review right now.');
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/48 px-4 py-6 backdrop-blur-[2px]'
      onClick={(event) => {
        if (event.target === event.currentTarget && !reviewMutation.isPending) {
          onClose();
        }
      }}
    >
      <div className='w-full max-w-[435px] rounded-[16px] bg-white p-6 shadow-[0_24px_60px_rgba(10,13,18,0.18)]'>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='text-[24px] font-extrabold leading-9 text-neutral-950'>
              Give Review
            </h2>
            <button
              type='button'
              onClick={onClose}
              disabled={reviewMutation.isPending}
              className='flex size-6 items-center justify-center text-neutral-950 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Close review modal'
            >
              <X className='size-6' strokeWidth={2.25} />
            </button>
          </div>

          <div className='flex flex-col items-center justify-center gap-0.5'>
            <p className='text-center text-base font-extrabold leading-7.5 text-neutral-950'>
              Give Rating
            </p>
            <div className='flex items-center justify-center gap-1'>
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;

                return (
                  <button
                    key={starValue}
                    type='button'
                    onClick={() => setRating(starValue)}
                    className='flex size-[49px] items-center justify-center cursor-pointer'
                    aria-label={`Give ${starValue} star rating`}
                  >
                    <Star
                      className={cn(
                        'size-10 transition-colors',
                        isActive
                          ? 'fill-[#f5a623] text-[#f5a623]'
                          : 'fill-[#a4a7ae] text-[#a4a7ae]'
                      )}
                      strokeWidth={1.75}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder='Please share your thoughts about our service!'
            className='h-[235px] w-full resize-none rounded-[12px] border border-neutral-300 px-3 py-2 text-base font-normal leading-7.5 tracking-tight text-neutral-950 outline-none placeholder:text-neutral-500'
          />

          <Button
            type='button'
            variant='primary'
            size='full'
            onClick={handleSubmit}
            disabled={reviewMutation.isPending}
            className='h-12 !text-white'
          >
            {reviewMutation.isPending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
