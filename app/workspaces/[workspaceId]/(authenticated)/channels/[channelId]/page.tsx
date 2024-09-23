import { getDbClient } from "@/lib/db";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { AutoRefresh } from "@/components/auto-refresh";
import { groupMessagesByDate, type Message } from "@/lib/utils";

type Params = { workspaceId: string; channelId: string };

export default async function ChannelPage({ params }: { params: Params }) {
  const db = getDbClient(params.workspaceId);
  const messagesResult = await db.execute({
    sql: `
      SELECT
        messages.id,
        messages.content,
        messages.created_at,
        messages.user_id,
        users.username,
        users.display_name
      FROM messages
      JOIN users ON messages.user_id = users.id
      WHERE messages.channel_id = ?
      ORDER BY messages.created_at DESC
      LIMIT 100
    `,
    args: [params.channelId],
  });

  const messages = messagesResult.rows as unknown as Message[];
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <AutoRefresh>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <MessageList groupedMessages={groupedMessages} />
        </div>
        <div className="flex-shrink-0">
          <MessageInput
            channelId={Number(params.channelId)}
            workspaceId={params.workspaceId}
          />
        </div>
      </div>
    </AutoRefresh>
  );
}
