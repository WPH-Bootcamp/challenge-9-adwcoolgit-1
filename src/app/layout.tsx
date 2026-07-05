import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import { Providers } from "@/app/providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Foody",
  description: "Restaurant ordering app assignment built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full bg-(--color-page)">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
