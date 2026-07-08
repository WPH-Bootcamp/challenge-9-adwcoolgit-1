import { Button } from '@/components/shared/button';
import { ChipButton } from '@/components/shared/chip-button';
import type { DiscoveryState } from '@/types/domain';

interface DiscoveryFilterBarProps {
  categoryOptions: string[];
  state: DiscoveryState;
  isBusy?: boolean;
  onCategoryChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onReset: () => void;
}

export function DiscoveryFilterBar({
  categoryOptions,
  state,
  isBusy = false,
  onCategoryChange,
  onRatingChange,
  onReset,
}: DiscoveryFilterBarProps) {
  const hasActiveFilters = Boolean(state.category || state.rating);

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-neutral-300 bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.12)]'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='text-lg font-extrabold leading-8 text-neutral-950'>
            Refine your search
          </p>
          <p className='text-sm font-medium leading-6 tracking-tight text-neutral-600'>
            Filter by category and rating while keeping the state in the URL.
          </p>
        </div>
        {hasActiveFilters ? (
          <Button
            type='button'
            variant='text'
            size='text'
            onClick={onReset}
            disabled={isBusy}
            className='text-sm font-bold leading-6 lg:text-sm lg:leading-6'
          >
            Reset filters
          </Button>
        ) : null}
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <ChipButton
          type='button'
          active={!state.category}
          onClick={() => onCategoryChange('')}
          disabled={isBusy}
          className='py-2 leading-[30px]'
        >
          All Categories
        </ChipButton>
        {categoryOptions.map((category) => (
          <ChipButton
            key={category}
            type='button'
            active={state.category === category}
            onClick={() => onCategoryChange(category)}
            disabled={isBusy}
            className='py-2 leading-[30px]'
          >
            {category}
          </ChipButton>
        ))}
        <ChipButton
          type='button'
          active={state.rating === '4.5'}
          onClick={() => onRatingChange(state.rating === '4.5' ? '' : '4.5')}
          disabled={isBusy}
          className='py-2 leading-[30px]'
        >
          Rating 4.5+
        </ChipButton>
      </div>
    </div>
  );
}
