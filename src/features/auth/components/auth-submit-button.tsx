import { Button } from '@/components/shared/button';

interface AuthSubmitButtonProps {
  isPending: boolean;
  idleLabel: string;
  pendingLabel: string;
}

export function AuthSubmitButton({
  isPending,
  idleLabel,
  pendingLabel,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type='submit'
      disabled={isPending}
      variant='primary'
      size='full'
    >
      {isPending ? pendingLabel : idleLabel}
    </Button>
  );
}
