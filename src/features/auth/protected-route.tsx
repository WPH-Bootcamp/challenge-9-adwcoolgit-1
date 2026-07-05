"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || isAuthenticated) {
      return;
    }

    const params = new URLSearchParams({
      redirect: pathname,
    });

    router.replace(`${redirectTo}?${params.toString()}`);
  }, [hasHydrated, isAuthenticated, pathname, redirectTo, router]);

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
