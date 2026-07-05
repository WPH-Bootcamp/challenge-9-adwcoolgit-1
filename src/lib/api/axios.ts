import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { clearAuthSession, getAccessToken } from "@/store/auth-store";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export type ApiQueryValue = string | number | boolean | null | undefined;

function attachAuthorization(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

function handleUnauthorized(error: AxiosError<ApiErrorResponse>) {
  if (error.response?.status === 401) {
    clearAuthSession();
  }

  return Promise.reject(error);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(attachAuthorization);
apiClient.interceptors.response.use((response) => response, handleUnauthorized);

export function unwrapResponse<T>(response: AxiosResponse<ApiSuccessResponse<T>>): T {
  return response.data.data;
}

export function toApiParams<T extends object>(params?: T) {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ) as Record<string, ApiQueryValue>;
}
