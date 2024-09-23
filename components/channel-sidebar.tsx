import Link from "next/link";

import { fetchChannels, fetchUsers } from "@/lib/actions";
import { CreateChannelForm } from "@/components/create-channel-form";
import { ChannelList } from "./channel-list";

export async function ChannelSidebar({ workspaceId }: { workspaceId: string }) {
  const channels = await fetchChannels(workspaceId);
  const users = await fetchUsers(workspaceId);

  const plainChannels = channels.map((channel) => ({
    id: Number(channel.id),
    name: String(channel.name),
  }));

  return (
    <div className="w-64 bg-[#0E1F22] text-white p-4">
      <h2 className="text-xl font-bold mb-4">Channels</h2>
      <ChannelList channels={plainChannels} workspaceId={workspaceId} />
      <CreateChannelForm workspaceId={workspaceId} />
      <h2 className="text-xl font-bold mb-4">Direct Messages</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            <Link
              href={`/workspaces/${workspaceId}/dm/${user.id}`}
              className="flex items-center"
            >
              <div className="w-5 h-5 rounded bg-gray-500 flex items-center justify-center mr-2">
                {user.username[0].toUpperCase()}
              </div>
              <span>{user.username}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
