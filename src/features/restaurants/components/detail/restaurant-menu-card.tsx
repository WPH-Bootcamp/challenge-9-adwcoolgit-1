import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { passthroughLoader } from "@/features/home/constants";
import type { MenuItem } from "@/types/domain";

interface RestaurantMenuCardProps {
  menu: MenuItem;
  quantity: number;
  isPending: boolean;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function RestaurantMenuCard({
  menu,
  quantity,
  isPending,
  onAdd,
  onIncrement,
  onDecrement,
}: RestaurantMenuCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_0_10px_rgba(203,202,202,0.25)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-(--color-neutral-100)">
        {menu.imageUrl ? (
          <Image
            loader={passthroughLoader}
            unoptimized
            src={menu.imageUrl}
            alt={menu.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-lg font-bold text-(--color-neutral-700)">
            {menu.name}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4">
        <div className="min-w-0 flex-1 text-(--color-neutral-950)">
          <p className="truncate text-sm font-medium leading-7 tracking-[var(--tracking-tight)] sm:text-base sm:leading-[30px]">
            {menu.name}
          </p>
          <p className="text-md font-extrabold leading-[30px] tracking-[var(--tracking-tight)] sm:text-lg sm:leading-8">
            {formatCurrency(menu.price)}
          </p>
        </div>

        {quantity > 0 ? (
          <div className="flex items-center gap-4 sm:shrink-0">
            <button
              type="button"
              onClick={onDecrement}
              disabled={isPending}
              aria-label={`Decrease ${menu.name} quantity`}
              className="flex size-9 items-center justify-center rounded-full border border-(--color-neutral-300) text-(--color-neutral-950) transition-colors hover:bg-(--color-neutral-100) disabled:opacity-60 sm:size-10"
            >
              <Minus className="size-5 sm:size-6" strokeWidth={1.75} />
            </button>
            <span className="min-w-3 text-center text-md font-semibold leading-[30px] tracking-[var(--tracking-tight)] text-(--color-neutral-950) sm:text-lg sm:leading-8">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              disabled={isPending}
              aria-label={`Increase ${menu.name} quantity`}
              className="flex size-9 items-center justify-center rounded-full bg-(--color-primary) text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:size-10"
            >
              <Plus className="size-5 sm:size-6" strokeWidth={1.75} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={isPending}
            className="flex h-9 w-full items-center justify-center rounded-full bg-(--color-primary) px-2 text-sm font-bold leading-7 tracking-[var(--tracking-tight)] text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:h-10 sm:w-[79px] sm:shrink-0 sm:text-base sm:leading-[30px]"
          >
            Add
          </button>
        )}
      </div>
    </article>
  );
}
