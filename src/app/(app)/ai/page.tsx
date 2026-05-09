import { getAIContext } from "@/lib/actions/ai-context";
import { AIChat } from "./_components/AIChat";
import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata = { title: "AI Assistant" };

export default async function AIPage() {
  const user = await requireAuth();

  const [context, employee] = await Promise.all([
    getAIContext().catch(() => ""),
    user.employeeId
      ? db.employee.findUnique({
          where: { id: user.employeeId },
          select: { firstName: true },
        })
      : null,
  ]);

  const firstName = employee?.firstName ?? (user.email ?? "there").split("@")[0];

  return <AIChat context={context} userName={firstName} />;
}
