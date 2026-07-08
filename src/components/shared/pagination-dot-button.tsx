import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface PaginationDotButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  active?: boolean;
  className?: string;
}

export function PaginationDotButton({
  active = false,
  className,
  ...props
}: PaginationDotButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'rounded-full transition-colors disabled:pointer-events-none disabled:opacity-60 cursor-pointer',
        active ? 'h-2 w-5 bg-(--color-primary)' : 'size-2 bg-neutral-300',
        className
      )}
    />
  );
}
