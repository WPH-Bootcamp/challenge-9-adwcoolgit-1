"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border border-(--color-neutral-300) bg-white text-(--color-neutral-950) shadow-[0_18px_50px_rgba(15,23,42,0.12)]",
          title: "font-bold",
          description: "text-sm text-(--color-neutral-700)",
          closeButton: "border-(--color-neutral-300) bg-white text-(--color-neutral-700)",
        },
      }}
      {...props}
    />
  );
}
