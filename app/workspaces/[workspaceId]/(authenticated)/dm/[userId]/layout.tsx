import { getDbClient } from "@/lib/db";

type LayoutProps = {
  children: React.ReactNode;
  params: { workspaceId: string; userId: string };
};

export default async function ChannelLayout({ children, params }: LayoutProps) {
  const db = getDbClient(params.workspaceId);
  const channelResult = await db.execute({
    sql: "SELECT username FROM users WHERE id = ?",
    args: [params.userId],
  });

  const userName =
    (channelResult.rows[0]?.username as string) || "Unknown User";

  return (
    <div className="flex flex-col h-full">
      <header className="bg-gray-100 p-4 border-b">
        <h1 className="text-xl font-bold">{userName}</h1>
      </header>
      <main className="flex-grow overflow-auto relative">{children}</main>
    </div>
  );
}
