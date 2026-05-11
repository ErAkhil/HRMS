import { getAIContext } from "@/lib/actions/ai-context";
import { AIChat } from "./_components/AIChat";
import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export const metadata = { title: "AI Assistant" };

export default async function AIPage() {
  const user = await requireAuth();

  const [context, profile] = await Promise.all([
    getAIContext().catch(() => ""),
    user.employeeId
      ? api.get<{ firstName: string } | null>("/employees/me/profile").catch(() => null)
      : Promise.resolve(null),
  ]);

  const firstName = (profile as { firstName?: string } | null)?.firstName
    ?? (user.email ?? "there").split("@")[0];

  return <AIChat context={context} userName={firstName} />;
}
