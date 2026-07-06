import Image from 'next/image';

import { FoodyLogo } from '@/components/shared/foody-logo';
import { passthroughLoader } from '@/features/home/constants';

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

export function HomeFooter() {
  return (
    <footer className='bg-neutral-950'>
      <div className='mx-auto flex max-w-[393px] flex-col gap-6 px-4 py-10 lg:grid lg:max-w-360 lg:grid-cols-[380px_200px_200px] lg:justify-between lg:gap-12 lg:px-30 lg:py-20'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-4'>
            <FoodyLogo surface='dark' />
            <p className='text-sm font-normal leading-7 tracking-tight text-(--color-neutral-25)'>
              Enjoy homemade flavors & chef&apos;s signature dishes, freshly
              prepared every day. Order online or visit our nearest branch.
            </p>
          </div>
          <div className='flex flex-col gap-5'>
            <p className='text-sm font-extrabold leading-7 text-(--color-neutral-25)'>
              Follow on Social Media
            </p>
            <div className='flex items-center gap-3'>
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

        <div className='grid grid-cols-2 gap-4 lg:contents'>
          <FooterColumn title='Explore' items={exploreLinks} />
          <FooterColumn title='Help' items={helpLinks} />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className='flex flex-col gap-5'>
      <p className='text-sm font-extrabold leading-7 text-(--color-neutral-25)'>
        {title}
      </p>
      {items.map((item) => (
        <p
          key={item}
          className='text-sm font-normal leading-7 tracking-tight text-(--color-neutral-25)'
        >
          {item}
        </p>
      ))}
    </div>
  );
}

function getIconifyIconUrl(name: string) {
  return `https://api.iconify.design/${name}.svg?color=%23FDFDFD&width=16&height=16`;
}
