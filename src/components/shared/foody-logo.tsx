import Image from 'next/image';

import { cn } from '@/lib/utils';

type FoodyLogoSurface = 'light' | 'dark';
type FoodyLogoMark = 'red' | 'white';
type FoodyLogoText = 'brand' | 'white';

interface FoodyLogoProps {
  surface?: FoodyLogoSurface;
  mark?: FoodyLogoMark;
  textTone?: FoodyLogoText;
  priority?: boolean;
  className?: string;
}

export function FoodyLogo({
  surface = 'dark',
  mark,
  textTone,
  priority = false,
  className,
}: FoodyLogoProps) {
  const resolvedMark = mark ?? (surface === 'light' ? 'red' : 'white');
  const resolvedTextTone = textTone ?? (surface === 'light' ? 'brand' : 'white');
  const logoSrc =
    resolvedMark === 'red' ? '/images/red-logo.svg' : '/images/white-logo.svg';
  const colorClassName =
    resolvedTextTone === 'brand' ? 'text-black' : 'text-white';

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
        priority={priority}
      />
      <span className='text-display-sm font-extrabold leading-9 sm:text-[32px] sm:leading-10.5'>
        Foody
      </span>
    </div>
  );
}
