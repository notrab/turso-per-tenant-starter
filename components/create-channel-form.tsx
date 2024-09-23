"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createChannel } from "@/lib/actions";

export function CreateChannelForm({ workspaceId }: { workspaceId: string }) {
  const [newChannelName, setNewChannelName] = useState("");
  const router = useRouter();

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newChannelName.trim()) {
      const result = await createChannel(workspaceId, newChannelName.trim());

      if (result.success) {
        setNewChannelName("");
        router.refresh();
      } else {
        alert("Failed to create channel. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleCreateChannel} className="mb-8">
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="New channel name"
          className="w-full px-2 py-1.5 bg-[#1F3136] focus:outline-none rounded"
        />
        <button
          type="submit"
          className="bg-[#126F4C] h-full text-white px-2 py-1.5 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
