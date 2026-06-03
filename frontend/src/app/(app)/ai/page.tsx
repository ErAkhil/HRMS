import { getAIContext } from "@/lib/actions/ai-context";
import { AIChat } from "./_components/AIChat";
import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";
import { getAiPlanInfo, listAiConversations } from "@/lib/actions/ai-conversations";
import type { AiConversationSummary, AiPlanInfo } from "@/lib/actions/ai-conversations";

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

  // Plan limits: BASIC=0, PRO=10, PRO_PLUS=50, PRO_MAX=Infinity
  const PLAN_LIMITS: Record<string, number> = { BASIC: 0, PRO: 10, PRO_PLUS: 50, PRO_MAX: Infinity };
  const MESSAGE_LIMITS: Record<string, number> = { BASIC: 20, PRO: 50, PRO_PLUS: 100, PRO_MAX: 200 };
  const planLimit = PLAN_LIMITS[user.plan] ?? 0;
  const msgLimit = MESSAGE_LIMITS[user.plan] ?? 30;
  const planInfoFallback: AiPlanInfo = {
    plan: user.plan,
    historyEnabled: planLimit > 0,
    maxConversations: planLimit === Infinity ? null : planLimit,
    maxMessagesPerThread: msgLimit,
  };

  const [planInfo, conversations] = await Promise.all([
    getAiPlanInfo().catch(() => planInfoFallback),
    listAiConversations().catch(() => [] as AiConversationSummary[]),
  ]);

  return (
    <AIChat
      context={context}
      userName={firstName}
      planInfo={planInfo}
      initialConversations={conversations}
    />
  );
}
