"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useShallow } from "zustand/react/shallow";

import { login, register } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth-store";
import type { ApiErrorResponse, AuthCredentials, RegisterPayload } from "@/types/api";
import { toAuthUser } from "@/types/domain";

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      return data.message;
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.join(" ");
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: AuthCredentials) => login(payload),
    onSuccess: (payload) => {
      const user = toAuthUser(payload.user);
      setSession({
        accessToken: payload.token,
        user,
      });
      queryClient.setQueryData(queryKeys.auth.profile(), payload.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (payload) => {
      const user = toAuthUser(payload.user);
      setSession({
        accessToken: payload.token,
        user,
      });
      queryClient.setQueryData(queryKeys.auth.profile(), payload.user);
    },
  });
}

export function useSessionUser() {
  return useAuthStore((state) => state.user);
}

export function useSessionState() {
  return useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      isAuthenticated: state.isAuthenticated,
      hasHydrated: state.hasHydrated,
      user: state.user,
    })),
  );
}
