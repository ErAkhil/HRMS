import { getChannels, getChannelMessages } from "@/lib/actions/messages";
import { MessagesPageClient } from "./_components/messages-page-client";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const channels = await getChannels().catch(() => []);
  const initialMessages = channels[0]
    ? await getChannelMessages(channels[0].id).catch(() => [])
    : [];

  return <MessagesPageClient channels={channels} initialMessages={initialMessages} initialChannelId={channels[0]?.id ?? null} />;
}
