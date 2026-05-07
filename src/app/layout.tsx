import "@/styles/satoshi.css";
import "@/styles/globals.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Inter, Manrope } from "next/font/google";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Unikove — AI-First Workplace",
    default: "Unikove — AI-First Workplace Platform",
  },
  description:
    "Enterprise HRMS + Collaboration platform. Manage people, communicate in real time, and drive productivity with AI-powered automation — all in one place.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body>
        <Providers>
          <NextTopLoader color="#4F46E5" showSpinner={false} height={2} />

          <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#111827]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
