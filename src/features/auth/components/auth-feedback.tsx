interface AuthFeedbackProps {
  message: string | null;
}

export function AuthFeedback({ message }: AuthFeedbackProps) {
  return message ? (
    <div
      className='rounded-xl border border-[rgba(193,33,22,0.18)] bg-[rgba(193,33,22,0.06)] px-(--space-xl) py-(--space-lg) 
    text-sm font-medium leading-5 tracking-tight text-(--color-primary)'
    >
      {message}
    </div>
  ) : null;
}
