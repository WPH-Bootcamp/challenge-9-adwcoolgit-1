import type { ReactNode } from "react";

import { AuthSessionBoundary } from "@/features/auth/auth-session-boundary";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthSessionBoundary>{children}</AuthSessionBoundary>;
}
