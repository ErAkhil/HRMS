import { getChannels, getChannelMessages } from "@/lib/actions/messages";
import { getDmConversations, getDmUsers } from "@/lib/actions/dm";
import { MessagesPageClient } from "./_components/messages-page-client";

export const metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ dm?: string; channel?: string }>;
}>) {
  const params = await searchParams;

  const [channels, conversations, dmUsers] = await Promise.all([
    getChannels().catch(() => []),
    getDmConversations().catch(() => []),
    getDmUsers().catch(() => []),
  ]);

  const initialMessages = channels[0]
    ? await getChannelMessages(channels[0].id).catch(() => [])
    : [];

  return (
    <MessagesPageClient
      channels={channels}
      conversations={conversations}
      dmUsers={dmUsers}
      initialMessages={initialMessages}
      initialChannelId={channels[0]?.id ?? null}
      initialDmId={params.dm ?? null}
      initialChannelParam={params.channel ?? null}
    />
  );
}
