'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { Button, LinkButton } from '@/components/shared/button';
import { ErrorState } from '@/components/shared/error-state';
import { FoodyLogo } from '@/components/shared/foody-logo';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang='en'>
      <body>
        <main className='min-h-screen bg-(--color-neutral-50) px-4 py-8 sm:px-6 md:px-8 lg:py-12'>
          <div className='mx-auto flex max-w-[520px] flex-col items-center gap-8'>
            <Link href='/' aria-label='Foody home' className='cursor-pointer'>
              <FoodyLogo surface='light' mark='red' textTone='brand' />
            </Link>

            <ErrorState
              title='Unable to open this page'
              description='An unexpected error interrupted the current flow. Please try again or return to the home page.'
              action={
                <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
                  <Button
                    type='button'
                    variant='primary'
                    className='!text-white'
                    onClick={reset}
                  >
                    Try Again
                  </Button>
                  <LinkButton href='/' variant='neutralOutline'>
                    Back to Home
                  </LinkButton>
                </div>
              }
            />
          </div>
        </main>
      </body>
    </html>
  );
}