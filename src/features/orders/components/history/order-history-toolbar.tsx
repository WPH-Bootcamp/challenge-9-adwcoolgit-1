'use client';

import { Search } from 'lucide-react';

import { ChipButton } from '@/components/shared/chip-button';

import { orderHistoryFilters, type OrderHistoryFilter } from '@/features/orders/hooks';

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
      <label className='flex h-11 w-full max-w-149 items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2'>
        <Search className='size-5 text-neutral-500' strokeWidth={2} />
        <input
          type='text'
          value={value}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search'
          className='h-full w-full border-none bg-transparent p-0 text-sm font-normal leading-7 tracking-tight text-neutral-600 outline-none placeholder:text-neutral-600'
        />
      </label>

      <div className='flex flex-col gap-3 md:flex-row md:items-center'>
        <p className='text-lg font-bold leading-8 tracking-tight text-neutral-950'>
          Status
        </p>
        <div className='flex flex-wrap gap-3'>
          {orderHistoryFilters.map((filter) => (
            <ChipButton
              key={filter.value}
              type='button'
              active={activeFilter === filter.value}
              onClick={() => onFilterChange(filter.value)}
              className='h-11 px-4 text-base'
            >
              {filter.label}
            </ChipButton>
          ))}
        </div>
      </div>
    </div>
  );
}
