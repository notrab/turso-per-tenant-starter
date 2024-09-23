import { AutoRefresh } from "@/components/auto-refresh";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { getDbClient } from "@/lib/db";
import { groupMessagesByDate, Message } from "@/lib/utils";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type Params = { workspaceId: string; userId: string };

export default async function DirectMessagePage({
  params,
}: {
  params: Params;
}) {
  const db = getDbClient(params.workspaceId);
  const currentUserId = getCurrentUser();

  if (!currentUserId) {
    redirect(`/workspaces/${params.workspaceId}/login`);
  }

  const messagesResult = await db.execute({
    sql: `
        SELECT
          dm.id,
          dm.content,
          dm.created_at,
          dm.sender_id as user_id,
          sender.username,
          sender.display_name
        FROM direct_messages dm
        JOIN users sender ON dm.sender_id = sender.id
        WHERE (dm.sender_id = ? AND dm.recipient_id = ?) OR (dm.sender_id = ? AND dm.recipient_id = ?)
        ORDER BY dm.created_at DESC
        LIMIT 100
      `,
    args: [currentUserId, params.userId, params.userId, currentUserId],
  });

  const messages = messagesResult.rows as unknown as Message[];
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <AutoRefresh>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto pb-4">
            <MessageList groupedMessages={groupedMessages} />
          </div>
        </div>
        <div className="flex-shrink-0">
          <MessageList groupedMessages={groupedMessages} />
          <MessageInput
            recipientId={Number(params.userId)}
            workspaceId={params.workspaceId}
            isDirect={true}
          />
        </div>
      </div>
    </AutoRefresh>
  );
}
