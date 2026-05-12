import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LandingPage } from "./_components/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monja — AI-First Workplace Platform",
  description: "Enterprise HRMS + Collaboration platform. Manage people, communicate in real time, and drive productivity with AI-powered automation — all in one place.",
};

export default async function MarketingRootPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return <LandingPage />;
}
