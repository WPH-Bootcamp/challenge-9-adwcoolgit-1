import Image from 'next/image';

import { cn } from '@/lib/utils';

interface FoodyLogoProps {
  surface?: 'light' | 'dark';
  className?: string;
}

export function FoodyLogo({ surface = 'dark', className }: FoodyLogoProps) {
  const logoSrc =
    surface === 'light' ? '/images/red-logo.svg' : '/images/white-logo.svg';
  const colorClassName =
    surface === 'light' ? 'text-(--color-primary)' : 'text-white';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 sm:gap-3.75',
        colorClassName,
        className
      )}
    >
      <Image
        src={logoSrc}
        alt='Foody mark'
        width={42}
        height={42}
        className='h-9 w-9 sm:h-10.5 sm:w-10.5'
        priority
      />
      <span className='text-display-sm font-extrabold leading-9 sm:text-[32px] sm:leading-10.5'>
        Foody
      </span>
    </div>
  );
}
