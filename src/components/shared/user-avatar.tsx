import Image from 'next/image';

import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  avatar?: string | null;
  className?: string;
  textClassName?: string;
  sizes?: string;
}

export function UserAvatar({
  name,
  avatar = null,
  className,
  textClassName,
  sizes = '48px',
}: UserAvatarProps) {
  if (avatar) {
    return (
      <div
        className={cn('relative overflow-hidden rounded-full', className)}
      >
        <Image
          loader={passthroughLoader}
          unoptimized
          src={avatar}
          alt={name}
          fill
          sizes={sizes}
          className='object-cover'
        />
      </div>
    );
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('');

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#fdb022_0%,#c12116_100%)] font-bold tracking-tight text-white',
        className,
        textClassName
      )}
    >
      {initials || 'JD'}
    </div>
  );
}

function passthroughLoader({ src }: { src: string }) {
  return src;
}
