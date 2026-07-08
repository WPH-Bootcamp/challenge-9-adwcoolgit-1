import Image from 'next/image';

import { FoodyLogo } from '@/components/shared/foody-logo';
import { passthroughLoader } from '@/features/home/constants';
import { cn } from '@/lib/utils';

const exploreLinks = [
  'All Food',
  'Nearby',
  'Discount',
  'Best Seller',
  'Delivery',
  'Lunch',
];

const helpLinks = [
  'How to Order',
  'Payment Methods',
  'Track My Order',
  'FAQ',
  'Contact Us',
];

const socialIcons = [
  getIconifyIconUrl('mdi/facebook'),
  getIconifyIconUrl('mdi/instagram'),
  getIconifyIconUrl('mdi/linkedin'),
  getIconifyIconUrl('simple-icons/tiktok'),
];

interface HomeFooterProps {
  variant?: 'default' | 'detail';
}

export function HomeFooter({ variant = 'default' }: HomeFooterProps) {
  const isDetailVariant = variant === 'detail';

  return (
    <footer
      className={cn(
        'bg-neutral-950',
        isDetailVariant && 'border-t border-neutral-800/80'
      )}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-360 flex-col items-start gap-8 px-4 sm:px-8 md:flex-row md:justify-between lg:px-30',
          isDetailVariant
            ? 'py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]'
            : 'py-10 lg:py-20'
        )}
      >
        <div className='mx-auto flex w-full max-w-[380px] flex-col items-start gap-10 md:mx-0 md:h-[284px] md:w-[380px] md:flex-none'>
          <div className='flex w-full flex-col items-start gap-[22px] md:h-[154px] md:w-[380px]'>
            <FoodyLogo
              surface='dark'
              mark='red'
              textTone='white'
              className='gap-[15px]'
            />
            <p className='w-full text-base font-normal leading-[30px] tracking-tight text-(--color-neutral-25) md:w-[380px]'>
              Enjoy homemade flavors & chef&apos;s signature dishes, freshly
              prepared every day. Order online or visit our nearest branch.
            </p>
          </div>

          <div className='flex w-[196px] flex-col items-start justify-center gap-5 md:h-[90px] md:flex-none'>
            <div className='flex h-[30px] w-[196px] items-center gap-2 self-stretch'>
              <p className='text-center text-base font-extrabold leading-[30px] text-(--color-neutral-25)'>
                Follow on Social Media
              </p>
            </div>
            <div className='flex h-10 w-[196px] items-center gap-3 self-stretch'>
              {socialIcons.map((iconUrl, index) => (
                <div
                  key={index}
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 text-(--color-neutral-25)'
                >
                  <Image
                    loader={passthroughLoader}
                    unoptimized
                    src={iconUrl}
                    alt=''
                    width={16}
                    height={16}
                    className='size-4'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <FooterColumn
          className='hidden md:flex'
          title='Explore'
          items={exploreLinks}
        />
        <FooterColumn
          className='hidden md:flex'
          title='Help'
          items={helpLinks}
        />
        <div className='flex  self-stretch md:hidden'>
          <FooterColumn title='Explore' items={exploreLinks} />
          <FooterColumn title='Help' items={helpLinks} />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  className,
}: {
  title: string;
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-82.5 w-50 flex-none flex-col items-start gap-5',
        className
      )}
    >
      <FooterRow label={title} isTitle />
      {items.map((item) => (
        <FooterRow key={item} label={item} />
      ))}
    </div>
  );
}

function FooterRow({
  label,
  isTitle = false,
}: {
  label: string;
  isTitle?: boolean;
}) {
  return (
    <div className='flex h-7.5 w-50 items-center gap-2 self-stretch bg-neutral-950'>
      <p
        className={cn(
          'text-center font-normal text-sm leading-6.75 md:text-base md:leading-7.5 text-(--color-neutral-25)',
          isTitle
            ? 'font-extrabold'
            : 'font-normal tracking-tight cursor-pointer'
        )}
      >
        {label}
      </p>
    </div>
  );
}

function getIconifyIconUrl(name: string) {
  return `https://api.iconify.design/${name}.svg?color=%23FDFDFD&width=16&height=16`;
}
