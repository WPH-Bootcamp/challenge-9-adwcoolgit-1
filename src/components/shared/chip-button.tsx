import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ChipButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className'
> {
  active?: boolean;
  children: ReactNode;
  className?: string;
}

export function ChipButton({
  active = false,
  children,
  className,
  ...props
}: ChipButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-full px-4 text-sm tracking-tight transition-colors disabled:pointer-events-none disabled:opacity-60 sm:text-base sm:leading-7.5 cursor-pointer',
        active
          ? 'border border-(--color-primary) bg-[#FFECEC] font-bold leading-7 text-(--color-primary)'
          : 'border border-neutral-300 bg-white font-semibold leading-7 text-neutral-950',
        className
      )}
    >
      {children}
    </button>
  );
}
