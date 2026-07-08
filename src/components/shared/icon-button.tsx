import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  variant?: 'outline' | 'primary' | 'ghost';
  children: ReactNode;
  className?: string;
}

export function IconButton({
  variant = 'outline',
  children,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-60 sm:size-10 cursor-pointer',
        variant === 'primary'
          ? 'bg-(--color-primary) text-white hover:opacity-90'
          : variant === 'ghost'
            ? 'bg-transparent text-current hover:opacity-80'
            : 'border border-(--color-neutral-300) text-(--color-neutral-950) hover:bg-(--color-neutral-100)',
        className
      )}
    >
      {children}
    </button>
  );
}
