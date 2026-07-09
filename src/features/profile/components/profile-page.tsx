'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/shared/button';
import { ErrorState } from '@/components/shared/error-state';
import { OrderHistoryPageSkeleton } from '@/components/shared/page-skeletons';
import { ProfileSidebar } from '@/components/shared/profile-sidebar';
import { UserAvatar } from '@/components/shared/user-avatar';
import {
  getApiErrorMessage,
  useSessionState,
  useUpdateProfileMutation,
} from '@/features/auth/hooks';
import { useCartQuery } from '@/features/cart/hooks';
import { HomeFooter } from '@/features/home/components/home-footer';
import { RestaurantDetailHeader } from '@/features/restaurants/components/detail/restaurant-detail-header';

export function ProfilePage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useSessionState();
  const cartQuery = useCartQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  const cartCount = cartQuery.data?.summary.totalItems ?? 0;
  const displayName = user?.name?.trim() || 'John Doe';
  const defaultEmail = user?.email?.trim() || 'johndoe@email.com';
  const defaultPhone = user?.phone?.trim() || '081234567890';
  const formKey = [
    user?.id ?? 'guest',
    user?.name ?? '',
    user?.email ?? '',
    user?.phone ?? '',
  ].join(':');

  if (!hasHydrated || (!isAuthenticated && !user)) {
    return (
      <main className='min-h-screen bg-(--color-neutral-50)'>
        <OrderHistoryPageSkeleton />
      </main>
    );
  }

  if (!user) {
    return (
      <main className='min-h-screen bg-(--color-neutral-50)'>
        <RestaurantDetailHeader
          isAuthenticated={isAuthenticated}
          user={user}
          cartCount={cartCount}
        />

        <div className='mx-auto flex max-w-300 px-4 py-8 sm:px-6 md:px-8 lg:px-0 lg:py-12'>
          <div className='w-full rounded-4 bg-white p-6 shadow-[0_0_10px_rgba(203,202,202,0.25)]'>
            <ErrorState
              title='Profile data is unavailable'
              description='We could not read your profile details right now. Please refresh the page and try again.'
              action={
                <Button
                  type='button'
                  variant='primary'
                  className='!text-white'
                  onClick={() => router.refresh()}
                >
                  Refresh
                </Button>
              }
            />
          </div>
        </div>

        <HomeFooter variant='detail' />
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-(--color-neutral-50)'>
      <RestaurantDetailHeader
        isAuthenticated={isAuthenticated}
        user={user}
        cartCount={cartCount}
      />

      <div className='mx-auto flex max-w-300 flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row md:items-start md:px-8 lg:gap-8 lg:px-0 lg:py-12'>
        <div className='hidden md:block'>
          <ProfileSidebar user={user} activeItem='profile' />
        </div>

        <section className='min-w-0 flex-1'>
          <div className='flex max-w-[524px] flex-col gap-6'>
            <h1 className='text-display-md font-extrabold leading-10.5 text-neutral-950'>
              Profile
            </h1>

            <div className='rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)] sm:p-6'>
              <form
                key={formKey}
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  updateProfileMutation.mutate(
                    {
                      name: String(formData.get('name') ?? '').trim(),
                      email: String(formData.get('email') ?? '').trim(),
                      phone: String(formData.get('phone') ?? '').trim(),
                    },
                    {
                      onSuccess: () => {
                        toast.success('Profile updated successfully.');
                      },
                      onError: (error) => {
                        toast.error(
                          getApiErrorMessage(
                            error,
                            'We could not update your profile right now.'
                          )
                        );
                      },
                    }
                  );
                }}
                className='flex flex-col gap-6'
              >
                <fieldset
                  disabled={updateProfileMutation.isPending}
                  className='flex flex-col gap-6 disabled:opacity-80'
                >
                  <div className='flex flex-col gap-3'>
                    <UserAvatar
                      name={displayName}
                      avatar={user.avatar ?? null}
                      className='size-16'
                      textClassName='text-lg leading-8'
                      sizes='64px'
                    />

                    <div className='flex flex-col gap-3'>
                      <ProfileField
                        label='Name'
                        name='name'
                        defaultValue={displayName}
                        autoComplete='name'
                        required
                      />
                      <ProfileField
                        label='Email'
                        name='email'
                        type='email'
                        defaultValue={defaultEmail}
                        autoComplete='email'
                        required
                      />
                      <ProfileField
                        label='Nomor Handphone'
                        name='phone'
                        type='tel'
                        defaultValue={defaultPhone}
                        autoComplete='tel'
                        required
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-3'>
                    <Button
                      type='submit'
                      variant='primary'
                      size='full'
                      className='h-11'
                    >
                      {updateProfileMutation.isPending
                        ? 'Updating...'
                        : 'Update Profile'}
                    </Button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </section>
      </div>

      <HomeFooter variant='detail' />
    </main>
  );
}

function ProfileField({
  label,
  name,
  defaultValue,
  type = 'text',
  autoComplete,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className='flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
      <span className='text-base font-medium leading-7.5 tracking-tight text-neutral-950'>
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        required={required}
        className='min-w-0 border-none bg-transparent p-0 text-left text-base font-bold leading-7.5 tracking-[-0.02em] text-neutral-950 outline-none placeholder:text-neutral-400 sm:w-62.5 sm:text-right'
      />
    </label>
  );
}
