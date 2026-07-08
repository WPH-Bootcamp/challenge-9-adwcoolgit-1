'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { LinkButton } from '@/components/shared/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { LoadingState } from '@/components/shared/loading-state';
import { getApiErrorMessage, useSessionState } from '@/features/auth/hooks';
import { useCartQuery, useUpdateCartItemQuantity } from '@/features/cart/hooks';
import { HomeFooter } from '@/features/home/components/home-footer';
import { RestaurantDetailHeader } from '@/features/restaurants/components/detail/restaurant-detail-header';
import type { BasketItem, OrderRecord } from '@/types/domain';
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from '@/lib/validations/checkout';

import { useCheckoutMutation } from '../hooks';
import { CheckoutCartGroupCard } from './checkout-cart-group-card';
import { CheckoutAddressCard } from './checkout-form-card';
import { CheckoutPaymentCard } from './checkout-summary-card';

const DEFAULT_ADDRESS = 'Jl. Sudirman No. 25, Jakarta Pusat, 10220';
const DEFAULT_PHONE = '0812-3456-7890';
const DELIVERY_FEE = 10000;
const SERVICE_FEE = 1000;

export function CheckoutPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useSessionState();
  const cartQuery = useCartQuery();
  const updateQuantity = useUpdateCartItemQuantity();
  const checkoutMutation = useCheckoutMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddressEditing, setIsAddressEditing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      deliveryAddress: DEFAULT_ADDRESS,
      phone: user?.phone ?? DEFAULT_PHONE,
      paymentMethod: 'Bank Negara Indonesia',
      notes: '',
    },
  });

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  useEffect(() => {
    const currentPhone = form.getValues('phone');

    if ((currentPhone === DEFAULT_PHONE || !currentPhone) && user?.phone) {
      form.setValue('phone', user.phone);
    }
  }, [form, user?.phone]);

  const groups = cartQuery.data?.groups ?? [];
  const summary = cartQuery.data?.summary;
  const cartCount = summary?.totalItems ?? 0;
  const basketTotal = summary?.totalPrice ?? 0;
  const deliveryFee = summary && groups.length > 0 ? DELIVERY_FEE : 0;
  const serviceFee = summary && groups.length > 0 ? SERVICE_FEE : 0;
  const grandTotal = basketTotal + deliveryFee + serviceFee;
  const isMutatingCart = updateQuantity.isPending;

  function handleQuantityChange(item: BasketItem, targetQuantity: number) {
    updateQuantity.mutate(
      {
        cartItemId: item.id,
        targetQuantity,
      },
      {
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Unable to update your basket right now.')
          );
        },
      }
    );
  }

  async function handleSubmit(values: CheckoutFormValues) {
    setSubmitError(null);

    try {
      const order = await checkoutMutation.mutateAsync({ groups, values });
      toast.success('Order placed successfully.');
      router.replace(buildPaymentSuccessUrl(order));
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, 'Unable to place your order right now.')
      );
    }
  }

  if (!hasHydrated || (!isAuthenticated && !cartQuery.data)) {
    return (
      <main className='min-h-screen bg-white'>
        <div className='mx-auto flex min-h-screen max-w-300 items-center justify-center px-4'>
          <LoadingState
            title='Preparing checkout'
            description='Checking your session and loading the latest basket data.'
          />
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-white'>
      <RestaurantDetailHeader
        isAuthenticated={isAuthenticated}
        user={user}
        cartCount={cartCount}
      />

      <div className='mx-auto flex max-w-360 flex-col gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-30 lg:py-12'>
        <h1 className='text-display-md font-extrabold leading-10.5 text-neutral-950'>
          Checkout
        </h1>

        {cartQuery.isLoading ? (
          <LoadingState
            title='Loading checkout details'
            description='Preparing your grouped basket and payment summary.'
          />
        ) : cartQuery.isError ? (
          <ErrorState
            title='Unable to load checkout'
            description='We could not load your current basket for checkout. Please try again in a moment.'
          />
        ) : groups.length === 0 || !summary ? (
          <div className='flex flex-col gap-4'>
            <EmptyState
              title='No items ready for checkout'
              description='Your basket is empty. Add menu items before continuing to checkout.'
            />
            <div className='flex justify-center'>
              <LinkButton href='/' variant='primary' className='!text-white'>
                Explore Restaurants
              </LinkButton>
            </div>
          </div>
        ) : (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start'
          >
            <div className='flex min-w-0 flex-col gap-5'>
              <CheckoutAddressCard
                form={form}
                isEditing={isAddressEditing}
                onToggleEditing={() => setIsAddressEditing((current) => !current)}
              />
              {groups.map((group) => (
                <CheckoutCartGroupCard
                  key={group.restaurantId}
                  group={group}
                  isPending={isMutatingCart || checkoutMutation.isPending}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            <CheckoutPaymentCard
              form={form}
              totalItems={summary.totalItems}
              basketTotal={basketTotal}
              deliveryFee={deliveryFee}
              serviceFee={serviceFee}
              grandTotal={grandTotal}
              isSubmitting={checkoutMutation.isPending}
              submitError={submitError}
            />
          </form>
        )}
      </div>

      <HomeFooter variant='detail' />
    </main>
  );
}

function buildPaymentSuccessUrl(order: OrderRecord) {
  const totalItems = order.restaurants.reduce(
    (sum, restaurant) =>
      sum + restaurant.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  const params = new URLSearchParams({
    createdAt: order.createdAt ?? new Date().toISOString(),
    paymentMethod: order.paymentMethod,
    items: String(totalItems),
    subtotal: String(order.pricing.subtotal),
    deliveryFee: String(order.pricing.deliveryFee),
    serviceFee: String(order.pricing.serviceFee),
    total: String(order.pricing.totalPrice),
  });

  return `/checkout/success?${params.toString()}`;
}
