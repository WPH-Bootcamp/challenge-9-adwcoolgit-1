'use client';

import { ProfileSidebar } from '@/components/shared/profile-sidebar';
import type { AuthUser } from '@/types/domain';

interface OrderHistorySidebarProps {
  user: AuthUser | null;
}

export function OrderHistorySidebar({ user }: OrderHistorySidebarProps) {
  return (
    <ProfileSidebar
      user={user}
      activeItem='orders'
      highlightActiveItem
    />
  );
}
