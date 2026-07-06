import { cn } from '@/lib/utils';
import type { DiscoveryState } from '@/types/domain';

interface DiscoveryFilterBarProps {
  categoryOptions: string[];
  state: DiscoveryState;
  isBusy?: boolean;
  onCategoryChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onReset: () => void;
}

function buildChipClassName(isActive: boolean) {
  return cn(
    'rounded-full border px-4 py-2 text-base leading-[30px] tracking-[var(--tracking-tight)] transition-colors',
    isActive
      ? 'border-(--color-primary) bg-[#FFECEC] font-bold text-(--color-primary)'
      : 'border-(--color-neutral-300) bg-white font-semibold text-(--color-neutral-950)'
  );
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
          <button
            type='button'
            onClick={onReset}
            disabled={isBusy}
            className='text-sm font-bold leading-6 text-(--color-primary) disabled:opacity-60'
          >
            Reset filters
          </button>
        ) : null}
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <button
          type='button'
          onClick={() => onCategoryChange('')}
          disabled={isBusy}
          className={buildChipClassName(!state.category)}
        >
          All Categories
        </button>
        {categoryOptions.map((category) => (
          <button
            key={category}
            type='button'
            onClick={() => onCategoryChange(category)}
            disabled={isBusy}
            className={buildChipClassName(state.category === category)}
          >
            {category}
          </button>
        ))}
        <button
          type='button'
          onClick={() => onRatingChange(state.rating === '4.5' ? '' : '4.5')}
          disabled={isBusy}
          className={buildChipClassName(state.rating === '4.5')}
        >
          Rating 4.5+
        </button>
      </div>
    </div>
  );
}

