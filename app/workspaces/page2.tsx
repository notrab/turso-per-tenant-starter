import { redirect } from "next/navigation";

import { getDbClient } from "@/lib/db";
import { CreateChannelForm } from "@/components/create-channel-form";

export default async function WorkspacePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const db = getDbClient(params.workspaceId);
  const channelsResult = await db.execute(
    "SELECT * FROM channels ORDER BY id ASC LIMIT 1",
  );

  if (channelsResult.rows.length > 0) {
    // Redirect to the first channel if it exists
    redirect(
      `/workspaces/${params.workspaceId}/channels/${channelsResult.rows[0].id}`,
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to {params.workspaceId} workspace
      </h1>
      <p className="mb-4">
        There are no channels in this workspace yet. Create your first channel
        to get started!
      </p>
      <CreateChannelForm workspaceId={params.workspaceId} />
    </div>
  );
}
