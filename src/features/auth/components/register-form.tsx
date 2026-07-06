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
import { getApiErrorMessage, useRegisterMutation } from '@/features/auth/hooks';
import { registerSchema, type RegisterValues } from '@/lib/validations/auth';

interface RegisterFormProps {
  redirectTo: string;
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const router = useRouter();
  const mutation = useRegisterMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      rememberMe: true,
    },
  });

  const rememberMe = useWatch({
    control: form.control,
    name: 'rememberMe',
  });

  async function onSubmit(values: RegisterValues) {
    setFormError(null);

    try {
      await mutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      router.replace(redirectTo);
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, 'Unable to create your account right now.')
      );
    }
  }

  return (
    <form
      className='flex w-full flex-col gap-(--space-xl)'
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className='flex flex-col gap-(--space-sm)'>
        <AuthInputField
          label='Name'
          error={form.formState.errors.name?.message}
          autoComplete='name'
          registration={form.register('name')}
        />
        <FieldError message={form.formState.errors.name?.message} />
      </div>
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
          label='Number Phone'
          error={form.formState.errors.phone?.message}
          autoComplete='tel'
          registration={form.register('phone')}
        />
        <FieldError message={form.formState.errors.phone?.message} />
      </div>
      <div className='flex flex-col gap-(--space-sm)'>
        <AuthInputField
          type={showPassword ? 'text' : 'password'}
          label='Password'
          error={form.formState.errors.password?.message}
          autoComplete='new-password'
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
      <div className='flex flex-col gap-(--space-sm)'>
        <AuthInputField
          type={showConfirmPassword ? 'text' : 'password'}
          label='Confirm Password'
          error={form.formState.errors.confirmPassword?.message}
          autoComplete='new-password'
          trailingAdornment={
            <AuthTrailingButton
              iconUrl={showConfirmPassword ? eyeOffIconUrl : eyeIconUrl}
              label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
              onClick={() => setShowConfirmPassword((current) => !current)}
            />
          }
          registration={form.register('confirmPassword')}
        />
        <FieldError message={form.formState.errors.confirmPassword?.message} />
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
        idleLabel='Create account'
        pendingLabel='Creating account...'
      />
    </form>
  );
}
