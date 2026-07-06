'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { eyeIconUrl, eyeOffIconUrl } from '@/features/auth/constants';
import {
  AuthInputField,
  AuthTrailingButton,
  CheckboxField,
  FieldError,
} from '@/features/auth/components/auth-field';
import { AuthFeedback } from '@/features/auth/components/auth-feedback';
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button';
import { getApiErrorMessage, useLoginMutation } from '@/features/auth/hooks';
import { loginSchema, type LoginValues } from '@/lib/validations/auth';

interface LoginFormProps {
  redirectTo: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const mutation = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const rememberMe = useWatch({
    control: form.control,
    name: 'rememberMe',
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);

    try {
      await mutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      router.replace(redirectTo);
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Unable to sign in right now.'));
    }
  }

  return (
    <form
      className='flex w-full flex-col gap-(--space-xl)'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className='flex flex-col gap-(--space-sm)'>
        <AuthInputField
          label='Email'
          error={form.formState.errors.email?.message}
          autoComplete='email'
          registration={form.register('email')}
        />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div className='flex flex-col gap-(--space-sm)'>
        <AuthInputField
          type={showPassword ? 'text' : 'password'}
          label='Password'
          error={form.formState.errors.password?.message}
          autoComplete='current-password'
          trailingAdornment={
            <AuthTrailingButton
              iconUrl={showPassword ? eyeOffIconUrl : eyeIconUrl}
              label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((current) => !current)}
            />
          }
          registration={form.register('password')}
        />
        <FieldError message={form.formState.errors.password?.message} />
      </div>
      <CheckboxField
        checked={rememberMe ?? true}
        onChange={(value) =>
          form.setValue('rememberMe', value, {
            shouldDirty: true,
            shouldTouch: true,
          })
        }
        label='Remember Me'
      />
      <AuthFeedback message={formError} />
      <AuthSubmitButton
        isPending={mutation.isPending}
        idleLabel='Sign in'
        pendingLabel='Signing in...'
      />
    </form>
  );
}
