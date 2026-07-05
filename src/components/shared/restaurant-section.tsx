import type { ReactNode } from "react";

interface RestaurantSectionProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export function RestaurantSection({
  title,
  description,
  action,
  children,
}: RestaurantSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-[28px] font-extrabold leading-[38px] text-(--color-neutral-950)">{title}</h2>
          <p className="max-w-2xl text-base font-medium leading-[30px] tracking-[-0.03em] text-(--color-neutral-600)">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
