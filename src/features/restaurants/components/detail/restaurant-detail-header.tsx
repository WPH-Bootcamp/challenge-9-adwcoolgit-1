import Link from "next/link";
import Image from "next/image";
import BagFillIcon from "@iconify-react/lets-icons/bag-fill";

import { Button } from "@/components/shared/button";
import { FoodyLogo } from "@/components/shared/foody-logo";
import { passthroughLoader } from "@/features/home/constants";
import type { AuthUser } from "@/types/domain";

interface RestaurantDetailHeaderProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  cartCount: number;
}

export function RestaurantDetailHeader({
  isAuthenticated,
  user,
  cartCount,
}: RestaurantDetailHeaderProps) {
  const userName = user?.name?.trim() || "John Doe";

  return (
    <header className="border-b border-neutral-300 bg-white shadow-[0_0_10px_rgba(203,202,202,0.25)]">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6 md:px-8 lg:px-16 xl:px-[120px]">
        <Link href="/" aria-label="Foody home">
          <FoodyLogo surface="light" />
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 text-neutral-950 sm:gap-4 md:gap-6">
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex size-8 items-center justify-center"
            >
              <BagFillIcon height="1em" className="size-7 sm:size-8" />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-1 flex size-5 items-center justify-center rounded-full bg-(--color-primary) text-[12px] font-bold leading-5 tracking-tight text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              ) : null}
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <UserAvatar name={userName} avatar={user?.avatar ?? null} />
              <p className="hidden text-lg font-semibold leading-8 tracking-tight md:block">
                {userName}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              href="/login"
              variant="neutralOutline"
              className="h-10 w-[108px] text-sm sm:h-12 sm:w-[163px] sm:text-base"
            >
              Sign in
            </Button>
            <Button
              href="/register"
              variant="primary"
              className="h-10 w-[108px] text-sm sm:h-12 sm:w-[163px] sm:text-base"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

function UserAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <div className="relative size-10 overflow-hidden rounded-full sm:size-12">
        <Image
          loader={passthroughLoader}
          unoptimized
          src={avatar}
          alt={name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fdb022_0%,#c12116_100%)] text-sm font-bold leading-7 tracking-tight text-white sm:size-12 sm:text-base sm:leading-[30px]">
      {initials || "JD"}
    </div>
  );
}
