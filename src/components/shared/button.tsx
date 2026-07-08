import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold tracking-[var(--tracking-tight)] transition-colors disabled:pointer-events-none disabled:opacity-60 cursor-pointer',
  {
    variants: {
      variant: {
        outline: 'border-2 border-neutral-300 bg-transparent text-white',
        solid: 'bg-white text-(--color-neutral-950)',
        primary: 'bg-(--color-primary) text-(--color-neutral-25)',
        neutralOutline:
          'border border-neutral-300 bg-transparent text-(--color-neutral-950)',
        text: 'h-auto w-auto bg-transparent p-0 text-(--color-primary)',
      },
      size: {
        default: 'h-12 w-[163px] rounded-full p-2 text-base leading-7.5',
        full: 'h-12 w-full rounded-full p-2 text-base leading-[30px]',
        compact: 'h-12 w-[160px] rounded-full p-2 text-base leading-[30px]',
        text: 'rounded-none text-base leading-[30px] lg:text-lg lg:leading-8',
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

interface LinkButtonProps extends ButtonBaseProps {
  href: string;
}

interface NativeButtonProps
  extends
    ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  href?: undefined;
}

type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({
  children,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const resolvedClassName = cn(buttonVariants({ variant, size }), className);

  if ('href' in props && props.href) {
    const { href } = props;

    return (
      <Link href={href} className={resolvedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={resolvedClassName}>
      {children}
    </button>
  );
}

export { buttonVariants };
