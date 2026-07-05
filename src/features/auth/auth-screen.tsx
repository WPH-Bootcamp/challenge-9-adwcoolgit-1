/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";

import { getApiErrorMessage, useLoginMutation, useRegisterMutation, useSessionState } from "@/features/auth/hooks";
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/lib/validations/auth";

const heroImageUrl = "https://www.figma.com/api/mcp/asset/3562d3dd-a81e-45eb-ab2b-89ae1fa751e4";
const logoMaskUrl = "https://www.figma.com/api/mcp/asset/04b02add-146c-42c3-b9c0-950a4f526fb5";
const logoImageUrl = "https://www.figma.com/api/mcp/asset/9b7d590b-be51-40e3-93e1-649f513d0df6";
const chevronDownUrl = "https://www.figma.com/api/mcp/asset/919fc7be-389e-43c1-a048-2bdd637e5882";
const eyeIconUrl = "https://www.figma.com/api/mcp/asset/eebaac2d-0fb9-4bc2-bbbe-a0ff32ce4fb3";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  mode: AuthMode;
}

interface InputFieldProps {
  type?: string;
  placeholder: string;
  error?: string;
  trailingIconUrl?: string;
  autoComplete?: string;
  registration: UseFormRegisterReturn;
}

function AuthInputField({
  type = "text",
  placeholder,
  error,
  trailingIconUrl,
  autoComplete,
  registration,
}: InputFieldProps) {
  return (
    <label className={`flex h-14 w-full items-center gap-2 rounded-xl border border-solid bg-white px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-[rgba(193,33,22,0.14)] ${error ? "border-(--color-primary)" : "border-(--color-neutral-300) focus-within:border-(--color-primary)"}`}>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="min-w-0 flex-1 border-none bg-transparent text-base font-normal leading-[30px] tracking-[-0.02em] text-(--color-neutral-950) outline-none placeholder:text-(--color-neutral-500)"
        {...registration}
      />
      {trailingIconUrl ? <img src={trailingIconUrl} alt="" className="h-4 w-4 shrink-0 object-contain" /> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="-mt-3 text-sm text-(--color-primary)">{message}</p> : null;
}

function FoodyLogo() {
  return (
    <div className="flex items-center gap-[15px]">
      <div className="relative h-[42px] w-[42px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            maskImage: `url(${logoMaskUrl})`,
            WebkitMaskImage: `url(${logoMaskUrl})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          <img src={logoImageUrl} alt="Foody mark" className="h-full w-full object-cover" />
        </div>
      </div>
      <span className="text-[32px] font-extrabold leading-[42px] text-(--color-neutral-950)">Foody</span>
    </div>
  );
}

function AuthTabs({ mode }: { mode: AuthMode }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-2xl bg-(--color-neutral-100) p-2">
      <Link
        href="/login"
        className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-base leading-[30px] transition-all ${mode === "login" ? "bg-white font-bold tracking-[-0.02em] text-(--color-neutral-950) shadow-[0_0_10px_rgba(203,202,202,0.25)]" : "font-medium tracking-[-0.03em] text-(--color-neutral-600)"}`}
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-base leading-[30px] transition-all ${mode === "register" ? "bg-white font-bold tracking-[-0.02em] text-(--color-neutral-950) shadow-[0_0_10px_rgba(203,202,202,0.25)]" : "font-medium tracking-[-0.03em] text-(--color-neutral-600)"}`}
      >
        Sign up
      </Link>
    </div>
  );
}

function AuthHero() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:block lg:w-1/2">
      <img
        src={heroImageUrl}
        alt="Burger hero"
        className="absolute left-[-425px] top-0 h-[1038px] w-[1477px] max-w-none object-cover"
      />
    </div>
  );
}

function AuthFeedback({ message }: { message: string | null }) {
  return message ? (
    <div className="rounded-2xl border border-[rgba(193,33,22,0.18)] bg-[rgba(193,33,22,0.06)] px-4 py-3 text-sm font-medium text-(--color-primary)">
      {message}
    </div>
  ) : null;
}

function CheckboxField({
  checked,
  onChange,
  label,
  error,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-base font-medium leading-[30px] tracking-[-0.03em] text-(--color-neutral-950)">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 rounded-[6px] border-(--color-neutral-300) text-(--color-primary) focus:ring-(--color-primary)"
        />
        <span>{label}</span>
      </label>
      {error ? <p className="text-sm text-(--color-primary)">{error}</p> : null}
    </div>
  );
}

function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const mutation = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const rememberMe = useWatch({
    control: form.control,
    name: "rememberMe",
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
      setFormError(getApiErrorMessage(error, "Unable to sign in right now."));
    }
  }

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthInputField
        placeholder="Email"
        error={form.formState.errors.email?.message}
        trailingIconUrl={chevronDownUrl}
        autoComplete="email"
        registration={form.register("email")}
      />
      <FieldError message={form.formState.errors.email?.message} />
      <AuthInputField
        type="password"
        placeholder="Password"
        error={form.formState.errors.password?.message}
        trailingIconUrl={eyeIconUrl}
        autoComplete="current-password"
        registration={form.register("password")}
      />
      <FieldError message={form.formState.errors.password?.message} />
      <CheckboxField
        checked={rememberMe ?? true}
        onChange={(value) => form.setValue("rememberMe", value)}
        label="Remember Me"
      />
      <AuthFeedback message={formError} />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-(--color-primary) px-2 py-2 text-base font-bold leading-[30px] tracking-[-0.02em] text-(--color-neutral-25) transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}

function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const mutation = useRegisterMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      agreeToTerms: true,
    },
  });

  const agreeToTerms = useWatch({
    control: form.control,
    name: "agreeToTerms",
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
      setFormError(getApiErrorMessage(error, "Unable to create your account right now."));
    }
  }

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthInputField
        placeholder="Full name"
        error={form.formState.errors.name?.message}
        autoComplete="name"
        registration={form.register("name")}
      />
      <FieldError message={form.formState.errors.name?.message} />
      <AuthInputField
        placeholder="Email"
        error={form.formState.errors.email?.message}
        trailingIconUrl={chevronDownUrl}
        autoComplete="email"
        registration={form.register("email")}
      />
      <FieldError message={form.formState.errors.email?.message} />
      <AuthInputField
        placeholder="Phone number"
        error={form.formState.errors.phone?.message}
        autoComplete="tel"
        registration={form.register("phone")}
      />
      <FieldError message={form.formState.errors.phone?.message} />
      <AuthInputField
        type="password"
        placeholder="Password"
        error={form.formState.errors.password?.message}
        trailingIconUrl={eyeIconUrl}
        autoComplete="new-password"
        registration={form.register("password")}
      />
      <FieldError message={form.formState.errors.password?.message} />
      <CheckboxField
        checked={agreeToTerms ?? true}
        onChange={(value) => form.setValue("agreeToTerms", value)}
        label="I agree to the terms"
        error={form.formState.errors.agreeToTerms?.message}
      />
      <AuthFeedback message={formError} />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-(--color-primary) px-2 py-2 text-base font-bold leading-[30px] tracking-[-0.02em] text-(--color-neutral-25) transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, hasHydrated } = useSessionState();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) {
      return;
    }

    router.replace(redirectTo);
  }, [hasHydrated, isAuthenticated, redirectTo, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-(--color-neutral-600)">
        Loading session...
      </div>
    );
  }

  const title = mode === "login" ? "Welcome Back" : "Create Account";
  const subtitle =
    mode === "login"
      ? "Good to see you again! Let's eat"
      : "Create your account and start discovering great meals";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        <AuthHero />
        <section className="flex min-h-screen flex-1 items-center justify-center px-6 py-12 lg:px-0">
          <div className="flex w-full max-w-[374px] flex-col items-start gap-5">
            <FoodyLogo />
            <header className="flex w-full flex-col gap-1 text-(--color-neutral-950)">
              <h1 className="text-[28px] font-extrabold leading-[38px]">{title}</h1>
              <p className="text-base font-medium leading-[30px] tracking-[-0.03em] text-(--color-neutral-950)">
                {subtitle}
              </p>
            </header>
            <AuthTabs mode={mode} />
            {mode === "login" ? <LoginForm redirectTo={redirectTo} /> : <RegisterForm redirectTo={redirectTo} />}
          </div>
        </section>
      </div>
    </main>
  );
}
