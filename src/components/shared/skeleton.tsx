import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'skeleton-shimmer rounded-[10px] bg-[linear-gradient(90deg,rgba(233,234,235,0.9)_0%,rgba(245,245,245,1)_50%,rgba(233,234,235,0.9)_100%)] bg-[length:200%_100%]',
        className
      )}
    />
  );
}
