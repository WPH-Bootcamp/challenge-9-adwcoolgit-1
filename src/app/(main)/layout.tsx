import type { ReactNode } from "react";

import { AuthSessionBoundary } from "@/features/auth/auth-session-boundary";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <AuthSessionBoundary>{children}</AuthSessionBoundary>;
}
