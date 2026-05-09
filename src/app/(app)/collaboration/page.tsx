import { getChannels, getCollaborationStats } from "@/lib/actions/collaboration";
import { CollaborationPageClient } from "./_components/collaboration-page-client";

export const metadata = { title: "Collaboration" };

export default async function CollaborationPage() {
  const [channels, stats] = await Promise.all([
    getChannels(),
    getCollaborationStats(),
  ]);

  return <CollaborationPageClient channels={channels} stats={stats} />;
}
