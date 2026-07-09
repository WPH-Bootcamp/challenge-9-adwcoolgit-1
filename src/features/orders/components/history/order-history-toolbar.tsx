'use client';

import { Search } from 'lucide-react';

import { ChipButton } from '@/components/shared/chip-button';

import {
  orderHistoryFilters,
  type OrderHistoryFilter,
} from '@/features/orders/hooks';

interface OrderHistoryToolbarProps {
  value: string;
  onSearchChange: (value: string) => void;
  activeFilter: OrderHistoryFilter;
  onFilterChange: (value: OrderHistoryFilter) => void;
}

export function OrderHistoryToolbar({
  value,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: OrderHistoryToolbarProps) {
  return (
    <div className='flex flex-col gap-5'>
      <label className='flex h-11 w-full items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2'>
        <Search
          className='size-5 shrink-0 text-neutral-500'
          strokeWidth={1.75}
        />
        <input
          type='text'
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search'
          className='h-full w-full border-none bg-transparent p-0 text-sm font-normal leading-7 tracking-tight text-neutral-600 outline-none placeholder:text-neutral-600'
        />
      </label>
      {/* Filter Buttons */}
      <div className='flex flex-wrap items-center gap-2'>
        <p className='shrink-0 text-sm font-bold leading-7 tracking-tight text-neutral-950'>
          Status
        </p>
        {orderHistoryFilters.map((filter) => (
          <ChipButton
            key={filter.value}
            type='button'
            active={activeFilter === filter.value}
            onClick={() => onFilterChange(filter.value)}
            className='h-10 px-4 text-sm leading-7 sm:text-base sm:leading-7.5'
          >
            {filter.label}
          </ChipButton>
        ))}
      </div>
    </div>
  );
}
