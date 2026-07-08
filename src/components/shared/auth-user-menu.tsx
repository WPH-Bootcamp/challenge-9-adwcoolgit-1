'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FileText, LogOut, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
        className='md:hidden cursor-pointer'
        aria-label='Open user menu'
        aria-expanded={isOpen}
      >
        <UserAvatar name={name} avatar={avatar} />
      </button>

      <div className='hidden md:flex md:items-center md:gap-3 sm:gap-4'>
        <UserAvatar name={name} avatar={avatar} />
        <p
          className={cn(
            'text-lg font-semibold leading-8 tracking-tight',
            desktopTextClassName
          )}
        >
          {name}
        </p>
      </div>

      {isOpen ? (
        <div className='absolute right-0 top-[calc(100%+12px)] z-50 w-[190px] rounded-[16px] bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)] md:hidden'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <UserAvatar name={name} avatar={avatar} compact />
              <p className='text-base font-bold leading-7.5 tracking-tight text-neutral-950'>
                {name}
              </p>
            </div>

            <div className='h-px w-full bg-neutral-200' />

            <div className='flex items-center gap-2 text-neutral-950'>
              <MapPin className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium leading-7'>Delivery Address</span>
            </div>

            <button
              type='button'
              onClick={handleOrdersClick}
              className='flex items-center gap-2 text-neutral-900 cursor-pointer'
            >
              <FileText className='size-5' strokeWidth={2} />
              <span className='text-sm font-medium leading-7'>My Orders</span>
            </button>

            <button
              type='button'
              onClick={handleLogoutClick}
              className='flex items-center gap-2 text-neutral-950 cursor-pointer'
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

function UserAvatar({
  name,
  avatar,
  compact = false,
}: {
  name: string;
  avatar: string | null;
  compact?: boolean;
}) {
  const sizeClassName = compact ? 'size-9' : 'size-10 sm:size-12';
  const textClassName = compact
    ? 'text-sm leading-7'
    : 'text-sm leading-7 sm:text-base sm:leading-[30px]';

  if (avatar) {
    return (
      <div className={cn('relative overflow-hidden rounded-full', sizeClassName)}>
        <Image
          loader={passthroughLoader}
          unoptimized
          src={avatar}
          alt={name}
          fill
          sizes={compact ? '36px' : '48px'}
          className='object-cover'
        />
      </div>
    );
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#fdb022_0%,#c12116_100%)] font-bold tracking-tight text-white',
        sizeClassName,
        textClassName
      )}
    >
      {initials || 'JD'}
    </div>
  );
}

function passthroughLoader({ src }: { src: string }) {
  return src;
}
