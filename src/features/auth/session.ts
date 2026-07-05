"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getProfile } from "@/lib/api/auth";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { toAuthUser } from "@/types/domain";

export function useAuthSessionSync() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: getProfile,
    enabled: hasHydrated && Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    setUser(toAuthUser(profileQuery.data));
  }, [profileQuery.data, setUser]);

  useEffect(() => {
    if (!profileQuery.error) {
      return;
    }

    clearSession();
  }, [clearSession, profileQuery.error]);

  return {
    isSessionLoading: profileQuery.isFetching,
    hasHydrated,
    accessToken,
  };
}
