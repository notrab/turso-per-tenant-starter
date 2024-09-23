import { getDbClient } from "@/lib/db";

type LayoutProps = {
  children: React.ReactNode;
  params: { workspaceId: string; channelId: string };
};

export default async function ChannelLayout({ children, params }: LayoutProps) {
  const db = getDbClient(params.workspaceId);
  const channelResult = await db.execute({
    sql: "SELECT name FROM channels WHERE id = ?",
    args: [params.channelId],
  });

  const channelName =
    (channelResult.rows[0]?.name as string) || "Unknown Channel";

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-100 p-4 border-b">
        <h1 className="text-xl font-bold">#{channelName}</h1>
      </header>
      <main className="flex-grow overflow-auto relative">{children}</main>
    </div>
  );
}
