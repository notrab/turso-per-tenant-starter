import { Sidebar } from "@/components/sidebar";
import { ChannelSidebar } from "@/components/channel-sidebar";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <div className="flex h-screen">
      <Sidebar currentWorkspace={params.workspaceId} />
      <ChannelSidebar workspaceId={params.workspaceId} />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
