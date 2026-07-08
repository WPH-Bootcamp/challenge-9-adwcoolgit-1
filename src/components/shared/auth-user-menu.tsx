'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FileText, LogOut, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { UserAvatar } from '@/components/shared/user-avatar';
import { cn } from '@/lib/utils';
import { clearAuthSession } from '@/store/auth-store';

interface AuthUserMenuProps {
  name: string;
  avatar: string | null;
  desktopTextClassName?: string;
}

export function AuthUserMenu({
  name,
  avatar,
  desktopTextClassName,
}: AuthUserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function handleProfileClick() {
    setIsOpen(false);
    router.push('/profile');
  }

  function handleOrdersClick() {
    setIsOpen(false);
    router.push('/orders');
  }

  function handleLogoutClick() {
    setIsOpen(false);
    clearAuthSession();
    router.replace('/login');
  }

  return (
    <div ref={containerRef} className='relative flex items-center gap-3 sm:gap-4'>
      <button
        type='button'
        onClick={() => setIsOpen((current) => !current)}
        className='cursor-pointer md:hidden'
        aria-label='Open user menu'
        aria-expanded={isOpen}
      >
        <UserAvatar
          name={name}
          avatar={avatar}
          className='size-10 sm:size-12'
          textClassName='text-sm leading-7 sm:text-base sm:leading-[30px]'
          sizes='48px'
        />
      </button>

      <Link
        href='/profile'
        aria-label='Open profile page'
        className='hidden cursor-pointer items-center md:flex md:gap-3 sm:gap-4'
      >
        <UserAvatar
          name={name}
          avatar={avatar}
          className='size-10 sm:size-12'
          textClassName='text-sm leading-7 sm:text-base sm:leading-[30px]'
          sizes='48px'
        />
        <p
          className={cn(
            'text-lg font-semibold leading-8 tracking-tight',
            desktopTextClassName
          )}
        >
          {name}
        </p>
      </Link>

      {isOpen ? (
        <div className='absolute right-0 top-[calc(100%+12px)] z-50 w-[190px] rounded-[16px] bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)] md:hidden'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <UserAvatar
                name={name}
                avatar={avatar}
                className='size-9'
                textClassName='text-sm leading-7'
                sizes='36px'
              />
              <p className='text-base font-bold leading-7.5 tracking-tight text-neutral-950'>
                {name}
              </p>
            </div>

            <div className='h-px w-full bg-neutral-200' />

            <button
              type='button'
              onClick={handleProfileClick}
              className='flex cursor-pointer items-center gap-2 text-neutral-950'
            >
              <MapPin className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium leading-7'>Delivery Address</span>
            </button>

            <button
              type='button'
              onClick={handleOrdersClick}
              className='flex cursor-pointer items-center gap-2 text-neutral-900'
            >
              <FileText className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium leading-7'>My Orders</span>
            </button>

            <button
              type='button'
              onClick={handleLogoutClick}
              className='flex cursor-pointer items-center gap-2 text-neutral-950'
            >
              <LogOut className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium leading-7'>Logout</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
