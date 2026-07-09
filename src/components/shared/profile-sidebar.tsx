'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileText, LogOut, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { UserAvatar } from '@/components/shared/user-avatar';
import { clearAuthSession } from '@/store/auth-store';
import type { AuthUser } from '@/types/domain';

interface ProfileSidebarProps {
  user: AuthUser | null;
  activeItem?: 'profile' | 'orders';
  highlightActiveItem?: boolean;
}

export function ProfileSidebar({
  user,
  activeItem,
  highlightActiveItem = false,
}: ProfileSidebarProps) {
  const router = useRouter();
  const displayName = user?.name?.trim() || 'John Doe';

  function handleLogout() {
    clearAuthSession();
    router.replace('/login');
  }

  return (
    <aside className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)] md:w-60'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <UserAvatar
            name={displayName}
            avatar={user?.avatar ?? null}
            className='size-12'
            textClassName='text-base leading-7.5'
            sizes='48px'
          />
          <p className='text-lg font-bold leading-8 tracking-tight text-neutral-950'>
            {displayName}
          </p>
        </div>

        <div className='h-px w-full bg-neutral-200' />

        <div className='flex flex-col gap-4'>
          <SidebarLink
            href='/profile'
            icon={
              <MapPin
                className={getIconClassName(
                  activeItem === 'profile',
                  highlightActiveItem
                )}
                strokeWidth={2}
              />
            }
            label='Delivery Address'
            isActive={activeItem === 'profile'}
            highlightActive={highlightActiveItem}
          />
          <SidebarLink
            href='/orders'
            icon={
              <FileText
                className={getIconClassName(
                  activeItem === 'orders',
                  highlightActiveItem
                )}
                strokeWidth={2}
              />
            }
            label='My Orders'
            isActive={activeItem === 'orders'}
            highlightActive={highlightActiveItem}
          />
          <button
            type='button'
            onClick={handleLogout}
            className='flex cursor-pointer items-center gap-2 text-left'
          >
            <LogOut className='size-6 text-neutral-950' strokeWidth={2} />
            <span className='text-base font-medium leading-7.5 tracking-tight text-neutral-950'>
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isActive,
  highlightActive,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  highlightActive: boolean;
}) {
  return (
    <Link href={href} className='flex cursor-pointer items-center gap-2'>
      {icon}
      <span
        className={
          highlightActive && isActive
            ? 'text-base font-medium leading-7.5 tracking-tight text-(--color-primary)'
            : 'text-base font-medium leading-7.5 tracking-tight text-neutral-950'
        }
      >
        {label}
      </span>
    </Link>
  );
}

function getIconClassName(isActive: boolean, highlightActive: boolean) {
  if (isActive && highlightActive) {
    return 'size-6 text-(--color-primary)';
  }

  return 'size-6 text-neutral-950';
}
