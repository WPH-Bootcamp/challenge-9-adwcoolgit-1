import { apiClient, unwrapResponse } from "@/lib/api/axios";
import type {
  AuthCredentials,
  AuthResponse,
  AuthResponsePayload,
  RegisterPayload,
  UserProfilePayload,
  UserProfileResponse,
} from "@/types/api";

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: Blob | null;
}

export function buildProfileFormData(input: UpdateProfileInput) {
  const formData = new FormData();

  if (input.name !== undefined) {
    formData.append("name", input.name);
  }

  if (input.email !== undefined) {
    formData.append("email", input.email);
  }

  if (input.phone !== undefined) {
    formData.append("phone", input.phone);
  }

  if (input.avatar) {
    formData.append("avatar", input.avatar);
  }

  return formData;
}

export async function login(payload: AuthCredentials): Promise<AuthResponsePayload> {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", payload);
  return unwrapResponse(response);
}

export async function register(payload: RegisterPayload): Promise<AuthResponsePayload> {
  const response = await apiClient.post<AuthResponse>("/api/auth/register", payload);
  return unwrapResponse(response);
}

export async function getProfile(): Promise<UserProfilePayload> {
  const response = await apiClient.get<UserProfileResponse>("/api/auth/profile");
  return unwrapResponse(response);
}

export async function updateProfile(formData: FormData): Promise<UserProfilePayload> {
  const response = await apiClient.put<UserProfileResponse>("/api/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return unwrapResponse(response);
}
