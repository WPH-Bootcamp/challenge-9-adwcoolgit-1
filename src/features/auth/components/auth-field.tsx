'use client';

import Image from 'next/image';
import type { ChangeEvent, FocusEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

import { checkIconUrl, passthroughLoader } from '@/features/auth/constants';

interface AuthInputFieldProps {
  type?: string;
  label: string;
  error?: string;
  trailingIconUrl?: string;
  trailingAdornment?: ReactNode;
  autoComplete?: string;
  registration: UseFormRegisterReturn;
}

export function AuthInputField({
  type = 'text',
  label,
  error,
  trailingIconUrl,
  trailingAdornment,
  autoComplete,
  registration,
}: AuthInputFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isActive = isFocused || hasValue;

  function syncHasValue() {
    setHasValue((inputRef.current?.value ?? '').trim().length > 0);
  }

  function handleFocus() {
    setIsFocused(true);
    syncHasValue();
  }

  function handleInput() {
    syncHasValue();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setHasValue(event.target.value.trim().length > 0);
    registration.onChange(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    setHasValue(event.target.value.trim().length > 0);
    registration.onBlur(event);
  }

  useEffect(() => {
    syncHasValue();

    const animationFrame = requestAnimationFrame(syncHasValue);
    const immediateTimer = window.setTimeout(syncHasValue, 0);
    const autofillTimer = window.setTimeout(syncHasValue, 250);
    const lateAutofillTimer = window.setTimeout(syncHasValue, 1000);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(immediateTimer);
      window.clearTimeout(autofillTimer);
      window.clearTimeout(lateAutofillTimer);
    };
  }, []);

  return (
    <label
      className={`box-border flex h-14 w-full items-center gap-8 self-stretch rounded-[10px] border bg-white px-3 ${error ? 'border-(--color-primary)' : 'border--300'} ${isFocused && !error ? 'shadow-[0_1px_2px_rgba(16,24,40,0.04)]' : ''}`}
    >
      {/* {isActive ? ( */}
      <div className='flex h-11.5 my-auto min-w-0 flex-1 flex-col justify-center self-stretch'>
        {isActive && (
          <span className='block w-full text-sm font-normal leading-4 tracking-tight text-neutral-500'>
            {label}
          </span>
        )}
        <input
          type={type}
          placeholder={isActive ? '' : label}
          autoComplete={autoComplete}
          aria-label={label}
          aria-invalid={Boolean(error)}
          className='auth-input flex h-7.5 w-full min-w-0 border-none bg-transparent p-0 text-left text-[16px] font-semibold leading-7.5 tracking-tight my-auto text-(--color-neutral-950) outline-none'
          {...registration}
          ref={(element) => {
            inputRef.current = element;
            registration.ref(element);
          }}
          onFocus={handleFocus}
          onChange={handleChange}
          onInput={handleInput}
          onBlur={handleBlur}
        />
      </div>
      {trailingAdornment ??
        (trailingIconUrl ? (
          <Image
            loader={passthroughLoader}
            unoptimized
            src={trailingIconUrl}
            alt=''
            width={16}
            height={16}
            className='h-4 w-4 flex-none'
          />
        ) : null)}
    </label>
  );
}

interface AuthTrailingButtonProps {
  iconUrl: string;
  label: string;
  onClick: () => void;
}

export function AuthTrailingButton({
  iconUrl,
  label,
  onClick,
}: AuthTrailingButtonProps) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className='flex h-4 w-4 flex-none items-center justify-center text-neutral-500'
    >
      <Image
        loader={passthroughLoader}
        unoptimized
        src={iconUrl}
        alt=''
        width={16}
        height={16}
        className='h-4 w-4'
      />
    </button>
  );
}

export function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className='text-[14px] leading-5 tracking-tight text-(--color-primary)'>
      {message}
    </p>
  ) : null;
}

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  error?: string;
}

export function CheckboxField({
  checked,
  onChange,
  label,
  error,
}: CheckboxFieldProps) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='flex cursor-pointer items-center gap-2 text-[16px] font-normal leading-7.5 tracking-tight text-(--color-neutral-950)'>
        <span className='relative flex h-4 w-4 flex-none items-center justify-center'>
          <input
            type='checkbox'
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            className='absolute inset-0 cursor-pointer opacity-0'
          />
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-1 border transition-colors ${checked ? 'border-(--color-primary) bg-(--color-primary)' : 'border-neutral-300 bg-white'}`}
          >
            {checked ? (
              <Image
                loader={passthroughLoader}
                unoptimized
                src={checkIconUrl}
                alt=''
                width={12}
                height={12}
                className='h-3 w-3'
              />
            ) : null}
          </span>
        </span>
        <span>{label}</span>
      </label>
      {error ? (
        <p className='text-[14px] leading-5 tracking-tight text-(--color-primary)'>
          {error}
        </p>
      ) : null}
    </div>
  );
}
