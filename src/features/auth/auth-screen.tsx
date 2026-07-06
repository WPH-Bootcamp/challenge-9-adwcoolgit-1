'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { authCopy } from '@/features/auth/constants';
import { AuthPageLayout } from '@/features/auth/components/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useSessionState } from '@/features/auth/hooks';
import type { AuthMode } from '@/features/auth/types';

interface AuthScreenProps {
  mode: AuthMode;
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, hasHydrated } = useSessionState();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) {
      return;
    }

    router.replace(redirectTo);
  }, [hasHydrated, isAuthenticated, redirectTo, router]);

  if (!hasHydrated) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white text-neutral-600'>
        Loading session...
      </div>
    );
  }

  const copy = authCopy[mode];

  return (
    <AuthPageLayout mode={mode} title={copy.title} subtitle={copy.subtitle}>
      {mode === 'login' ? (
        <LoginForm redirectTo={redirectTo} />
      ) : (
        <RegisterForm redirectTo={redirectTo} />
      )}
    </AuthPageLayout>
  );
}
