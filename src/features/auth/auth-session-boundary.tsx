"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAuthSessionSync } from "@/features/auth/session";
import { useAuthStore } from "@/store/auth-store";

interface AuthSessionBoundaryProps {
  children: ReactNode;
}

export function AuthSessionBoundary({ children }: AuthSessionBoundaryProps) {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const markHydrated = useAuthStore((state) => state.markHydrated);
  const { isSessionLoading, accessToken } = useAuthSessionSync();

  useEffect(() => {
    if (!hasHydrated) {
      markHydrated();
    }
  }, [hasHydrated, markHydrated]);

  if (!hasHydrated) {
    return null;
  }

  if (accessToken && isSessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm font-medium text-(--color-neutral-600)">
        Restoring your session...
      </div>
    );
  }

  return <>{children}</>;
}
