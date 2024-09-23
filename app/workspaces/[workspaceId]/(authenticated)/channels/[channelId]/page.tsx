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

  // const groupedMessages = messagesResult.rows.map((row: any) => ({
  //   message_date: row.message_date,
  //   messages: JSON.parse(row.messages),
  // })) as GroupedMessage[];

  return (
    <AutoRefresh>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <div className="h-full overflow-y-auto pb-4">
            <MessageList groupedMessages={groupedMessages} />
          </div>
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

// import { MessageList } from "@/components/message-list";
// import { MessageInput } from "@/components/message-input";
// import { getDbClient } from "@/lib/db";
// import { Metadata } from "next";

// type ChannelResult = {
//   name: string;
// };

// type MessageResult = {
//   message_date: string;
//   messages: string; // JSON string
// };

// type Params = { workspaceId: string; channelId: string };

// export default async function ChannelPage({ params }: { params: Params }) {
//   const db = getDbClient(params.workspaceId);
//   const [channelResult, messagesResult] = await Promise.all([
//     db.execute({
//       sql: "SELECT name FROM channels WHERE id = ?",
//       args: [params.channelId],
//     }),
//     db.execute({
//       sql: `
//         SELECT
//           DATE(messages.created_at) as message_date,
//           JSON_GROUP_ARRAY(
//             JSON_OBJECT(
//               'id', messages.id,
//               'content', messages.content,
//               'created_at', messages.created_at,
//               'username', users.username,
//               'display_name', users.display_name
//             )
//           ) as messages
//         FROM messages
//         JOIN users ON messages.user_id = users.id
//         WHERE messages.channel_id = ?
//         GROUP BY DATE(messages.created_at), messages.user_id
//         ORDER BY DATE(messages.created_at) DESC, messages.created_at ASC
//         LIMIT 7
//       `,
//       args: [params.channelId],
//     }),
//   ]);

//   const channelName =
//     (channelResult.rows[0] as unknown as ChannelResult | undefined)?.name ||
//     "Unknown Channel";

//   const serializedMessages = (
//     messagesResult.rows as unknown as MessageResult[]
//   ).map((row) => ({
//     message_date: row.message_date,
//     messages: JSON.parse(row.messages),
//   }));

//   return (
//     <div className="flex flex-col h-full">
//       <header className="bg-gray-100 p-4 border-b">
//         <h1 className="text-xl font-bold">#{channelName}</h1>
//       </header>
//       <div className="flex-grow overflow-auto">
//         <MessageList groupedMessages={serializedMessages} />
//       </div>
//       <MessageInput
//         channelId={Number(params.channelId)}
//         workspaceId={params.workspaceId}
//       />
//     </div>
//   );
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Params;
// }): Promise<Metadata> {
//   const db = getDbClient(params.workspaceId);
//   const channelResult = await db.execute({
//     sql: "SELECT name FROM channels WHERE id = ?",
//     args: [params.channelId],
//   });

//   const channelName = channelResult.rows[0]?.name || "Channel";

//   return {
//     title: `${channelName} - ${params.workspaceId} Workspace`,
//   };
// }
