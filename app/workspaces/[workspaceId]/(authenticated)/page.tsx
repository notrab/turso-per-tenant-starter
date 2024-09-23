import { redirect } from "next/navigation";

import { getDbClient } from "@/lib/db";
import { CreateChannelForm } from "@/components/create-channel-form";

type Params = { workspaceId: string };

export default async function WorkspacePage({ params }: { params: Params }) {
  const db = getDbClient(params.workspaceId);
  const channelsResult = await db.execute(
    "SELECT * FROM channels ORDER BY id ASC LIMIT 1",
  );

  if (channelsResult.rows.length > 0) {
    redirect(
      `/workspaces/${params.workspaceId}/channels/${channelsResult.rows[0].id}`,
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-3">
        Welcome to {params.workspaceId} workspace!
      </h1>
      <p className="mb-6 text-gray-500">
        There are no channels in this workspace yet. <br />
        Create your first channel to get started!
      </p>
      <CreateChannelForm workspaceId={params.workspaceId} />
    </div>
  );
}
