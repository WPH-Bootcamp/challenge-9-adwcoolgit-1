import Link from 'next/link';
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold tracking-[var(--tracking-tight)] transition-colors disabled:pointer-events-none disabled:opacity-60 cursor-pointer',
  {
    variants: {
      variant: {
        outline: 'border-2 border-neutral-300 bg-transparent text-white',
        solid: 'bg-white text-neutral-950',
        primary:
          'bg-(--color-primary) text-white visited:text-white hover:text-white',
        neutralOutline:
          'border border-neutral-300 bg-transparent text-neutral-950',
        text: 'h-auto w-auto bg-transparent p-0 text-(--color-primary)',
      },
      size: {
        default: 'h-12 w-40.75 rounded-full p-2 text-base leading-7.5',
        full: 'h-12 w-full rounded-full p-2 text-base leading-7.5',
        compact: 'h-12 w-40 rounded-full p-2 text-base leading-7.5',
        text: 'rounded-none text-base leading-7.5 lg:text-lg lg:leading-8',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  }
);

interface ButtonBaseProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
}

interface NativeButtonProps
  extends
    ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {}

interface LinkButtonProps
  extends
    ButtonBaseProps,
    Omit<ComponentPropsWithoutRef<typeof Link>, 'children' | 'className'> {}

export function Button({
  children,
  className,
  variant,
  size,
  ...props
}: NativeButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}

export { buttonVariants };

