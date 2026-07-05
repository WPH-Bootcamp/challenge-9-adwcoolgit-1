import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNumberParam(value: string | null | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function compactRecord<T extends string | number | undefined | null>(
  input: Record<string, T>,
) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}
