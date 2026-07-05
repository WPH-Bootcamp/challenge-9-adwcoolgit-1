interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className='rounded-3xl border border-dashed border-(--border-soft) bg-(--surface) p-6 text-center'>
      <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
      <p className='mt-2 text-sm text-(--foreground-muted)'>{description}</p>
    </div>
  );
}
