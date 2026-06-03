import { requireRole } from "@/lib/session";
import { SecurityPageClient } from "./_components/SecurityPageClient";

export const metadata = { title: "Security Settings" };

export default async function SecurityPage() {
  await requireRole("SUPER_ADMIN");
  return <SecurityPageClient />;
}
