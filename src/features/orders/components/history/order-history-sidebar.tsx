'use client';

import type { ReactNode } from 'react';
import { FileText, LogOut, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { clearAuthSession } from '@/store/auth-store';
import type { AuthUser } from '@/types/domain';

interface OrderHistorySidebarProps {
  user: AuthUser | null;
}

export function OrderHistorySidebar({ user }: OrderHistorySidebarProps) {
  const router = useRouter();
  const displayName = user?.name?.trim() || 'John Doe';

  function handleLogout() {
    clearAuthSession();
    router.replace('/login');
  }

  return (
    <aside className='w-full rounded-[16px] bg-white p-5 shadow-[0_0_10px_rgba(203,202,202,0.25)] lg:w-60'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <UserAvatar name={displayName} />
          <p className='text-lg font-bold leading-8 tracking-tight text-neutral-950'>
            {displayName}
          </p>
        </div>

        <div className='h-px w-full bg-neutral-200' />

        <div className='flex flex-col gap-4'>
          <SidebarItem icon={<MapPin className='size-6' strokeWidth={2} />} label='Delivery Address' />
          <SidebarItem icon={<FileText className='size-6 text-(--color-primary)' strokeWidth={2} />} label='My Orders' active />
          <button
            type='button'
            onClick={handleLogout}
            className='flex items-center gap-2 text-left cursor-pointer'
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

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div className='flex items-center gap-2'>
      {icon}
      <span
        className={`text-base font-medium leading-7.5 tracking-tight ${active ? 'text-(--color-primary)' : 'text-neutral-950'}`}
      >
        {label}
      </span>
    </div>
  );
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('');

  return (
    <div className='flex size-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fdb022_0%,#c12116_100%)] text-base font-bold leading-7.5 tracking-tight text-white'>
      {initials || 'JD'}
    </div>
  );
}
