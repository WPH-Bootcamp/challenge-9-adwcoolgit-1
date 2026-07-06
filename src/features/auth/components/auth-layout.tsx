import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { FoodyLogo } from '@/components/shared/foody-logo';
import { heroImageUrl, passthroughLoader } from '@/features/auth/constants';
import type { AuthMode } from '@/features/auth/types';

interface AuthPageLayoutProps {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthPageLayout({
  mode,
  title,
  subtitle,
  children,
}: AuthPageLayoutProps) {
  return (
    <main className='min-h-screen bg-white'>
      <div className='mx-auto flex min-h-screen max-w-360 flex-col lg:flex-row'>
        <AuthHero />
        <section className='flex min-h-screen flex-1 items-center justify-center px-6 py-12 lg:px-0'>
          <div className='flex w-full max-w-93.5 flex-col items-stretch gap-(--space-2xl)'>
            <FoodyLogo surface='light' />
            <AuthHeader title={title} subtitle={subtitle} />
            <AuthTabs mode={mode} />
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className='flex w-full flex-col gap-(--space-xxs) text-(--color-neutral-950)'>
      <h1 className='text-(--text-display-sm-size) font-extrabold leading-(--text-display-sm-line)'>
        {title}
      </h1>
      <p className='text-md font-medium leading-(--text-md-line) tracking-(--tracking-tightest) text-(--color-neutral-950)'>
        {subtitle}
      </p>
    </header>
  );
}

function AuthTabs({ mode }: { mode: AuthMode }) {
  return (
    <div className='flex w-full items-center gap-(--space-md) rounded-2xl bg-neutral-100 p-(--space-md)'>
      <Link
        href='/login'
        className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl px-(--space-lg) py-md text-(--text-md-size) leading-(--text-md-line) transition-all ${mode === 'login' ? 'bg-white font-bold tracking-tight text-(--color-neutral-950) shadow-[0_0_10px_rgba(203,202,202,0.25)]' : 'font-medium tracking-tightest text-neutral-600'}`}
      >
        Sign in
      </Link>
      <Link
        href='/register'
        className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl px-(--space-lg) py-(--space-md) text-(--text-md-size) leading-(--text-md-line) transition-all ${mode === 'register' ? 'bg-white font-bold tracking-tight text-(--color-neutral-950) shadow-[0_0_10px_rgba(203,202,202,0.25)]' : 'font-medium tracking-(--tracking-tightest) text-neutral-600'}`}
      >
        Sign up
      </Link>
    </div>
  );
}

function AuthHero() {
  return (
    <div className='relative hidden min-h-screen overflow-hidden lg:block lg:w-1/2'>
      <div className='absolute left-106.25 top-0 h-259.5 w-369.25 max-w-none'>
        <Image
          loader={passthroughLoader}
          unoptimized
          src={heroImageUrl}
          alt='Burger hero'
          fill
          priority
          sizes='1477px'
          className='object-cover'
        />
      </div>
    </div>
  );
}
