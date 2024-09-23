"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type Channel = {
  id: number;
  name: string;
};

export function ChannelList({
  channels,
  workspaceId,
}: {
  channels: Channel[];
  workspaceId: string;
}) {
  const params = useParams();
  const activeChannelId = params.channelId;

  return (
    <ul className="mb-4">
      {channels.map((channel) => (
        <li
          key={channel.id}
          className={`rounded ${channel.id.toString() === activeChannelId ? "bg-[#126F4C]" : "transition hover:bg-[#1F3136]"}`}
        >
          <Link
            href={`/workspaces/${workspaceId}/channels/${channel.id}`}
            className={`mb-0.5 flex items-center px-2 py-1.5 rounded ${channel.id.toString() === activeChannelId ? "text-white" : "text-gray-300 hover:text-white"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
              />
            </svg>
            {channel.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
