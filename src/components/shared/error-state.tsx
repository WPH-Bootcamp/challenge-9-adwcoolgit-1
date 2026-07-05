import type { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  description: string;
  action?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  action,
}: ErrorStateProps) {
  return (
    <div className='rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-950'>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <p className='mt-2 text-sm text-red-800'>{description}</p>
      {action ? <div className='mt-4'>{action}</div> : null}
    </div>
  );
}
