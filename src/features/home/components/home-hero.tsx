import Link from 'next/link';
import Image from 'next/image';
import BagFillIcon from '@iconify-react/lets-icons/bag-fill';

import { LinkButton } from '@/components/shared/button';
import { FoodyLogo } from '@/components/shared/foody-logo';
import { AuthUserMenu } from '@/components/shared/auth-user-menu';
import {
  homeHeroImageUrl,
  homeSearchIconUrl,
  passthroughLoader,
} from '@/features/home/constants';
import type { AuthUser } from '@/types/domain';

interface HomeHeroProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  cartCount: number;
  searchValue: string;
  onSearchSubmit: (value: string) => void;
}

export function HomeHero({
  isAuthenticated,
  user,
  cartCount,
  searchValue,
  onSearchSubmit,
}: HomeHeroProps) {
  const userName = user?.name?.trim() || 'John Doe';

  return (
    <section className='relative isolate overflow-hidden bg-(--color-base-black)'>
      <div className='absolute inset-0'>
        <Image
          loader={passthroughLoader}
          unoptimized
          src={homeHeroImageUrl}
          alt='Foody hero background'
          fill
          priority
          sizes='100vw'
          className='object-cover'
        />
        <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_59.976%,rgba(0,0,0,0.8)_110.09%)]' />
      </div>

      <div className='relative mx-auto flex min-h-140 max-w-360 flex-col px-4 pb-16 sm:min-h-160 sm:px-6 sm:pb-24 md:px-8 lg:min-h-206.75 lg:px-30 lg:pb-30'>
        <header className='flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4'>
          <FoodyLogo surface='dark' priority />

          {isAuthenticated ? (
            <div className='flex items-center gap-3 sm:gap-4 md:gap-6'>
              <Link
                href='/cart'
                aria-label='Cart'
                className='relative flex size-8 cursor-pointer items-center justify-center text-white sm:size-8'
              >
                <BagFillIcon height='1em' className='size-7 sm:size-8' />
                {cartCount > 0 ? (
                  <span className='absolute -right-2 -top-1 flex size-5 items-center justify-center rounded-full bg-(--color-primary) text-[12px] font-bold leading-5 tracking-tight text-white'>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                ) : null}
              </Link>
              <AuthUserMenu
                name={userName}
                avatar={user?.avatar ?? null}
                desktopTextClassName='text-white'
              />
            </div>
          ) : (
            <div className='flex items-center gap-2 sm:gap-3'>
              <LinkButton
                href='/login'
                variant='outline'
                className='h-10 w-27 text-sm !text-white visited:!text-white hover:!text-white sm:h-12 sm:w-40.75 sm:text-base'
              >
                Sign in
              </LinkButton>
              <LinkButton
                href='/register'
                variant='solid'
                className='h-10 w-27 text-sm sm:h-12 sm:w-40.75 sm:text-base'
              >
                Sign up
              </LinkButton>
            </div>
          )}
        </header>

        <div className='flex flex-1 items-center justify-center'>
          <div className='flex w-full max-w-178 flex-col items-center gap-6 pt-4 text-white sm:gap-8 sm:pt-6 lg:gap-10 lg:pt-10'>
            <div className='flex w-full flex-col items-center gap-2'>
              <h1 className='w-full text-center text-display-md font-extrabold leading-10 sm:text-display-lg sm:leading-11 lg:text-5xl lg:leading-15'>
                Explore Culinary Experiences
              </h1>
              <p className='w-full text-center text-lg font-bold leading-8 sm:text-display-xs sm:leading-9'>
                Search and refine your choice to discover the perfect
                restaurant.
              </p>
            </div>

            <form
              key={searchValue}
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                onSearchSubmit(String(formData.get('discovery-search') ?? ''));
              }}
              className='flex h-14 w-full max-w-151 items-center gap-1.5 rounded-full bg-white px-5 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.18)] sm:px-6'
            >
              <div className='relative size-5 flex-none'>
                <Image
                  loader={passthroughLoader}
                  unoptimized
                  src={homeSearchIconUrl}
                  alt=''
                  fill
                  sizes='20px'
                  className='object-contain'
                />
              </div>
              <input
                type='text'
                name='discovery-search'
                aria-label='Search restaurants'
                placeholder='Search restaurants, food and drink'
                defaultValue={searchValue}
                className='h-full w-full border-none bg-transparent p-0 text-sm font-normal leading-7 tracking-tight text-neutral-600 outline-none placeholder:text-neutral-600 sm:text-base sm:leading-7.5'
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
