interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = 'Loading...',
  description = 'Please wait while content is being prepared.',
}: LoadingStateProps) {
  return (
    <div className='rounded-3xl border border-(--border-soft) bg-(--surface) p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]'>
      <div className='mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-(--border-soft) border-t-(--accent-strong)' />
      <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
      <p className='mt-2 text-sm text-(--foreground-muted)'>{description}</p>
    </div>
  );
}
