"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMessage, createDirectMessage } from "@/lib/actions";

type MessageInputProps = {
  channelId?: number;
  recipientId?: number;
  workspaceId: string;
  isDirect?: boolean;
};

export function MessageInput({
  channelId,
  recipientId,
  workspaceId,
  isDirect = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isDirect && recipientId) {
      await createDirectMessage(workspaceId, recipientId, message);
    } else if (channelId) {
      await createMessage(workspaceId, channelId, message);
    }

    setMessage("");
    router.refresh();
  };

  return (
    <form onSubmit={sendMessage} className="p-4 border-t bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Type a message..."
      />
    </form>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { createMessage } from "@/lib/actions";

// export function MessageInput({
//   channelId,
//   workspaceId,
// }: {
//   channelId: number;
//   workspaceId: string;
// }) {
//   const [message, setMessage] = useState("");
//   const router = useRouter();

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!message.trim()) return;

//     await createMessage(workspaceId, channelId, message);
//     setMessage("");
//     router.refresh();
//   };

//   return (
//     <form onSubmit={sendMessage} className="p-4 border-t mt-auto">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className="w-full p-2 border rounded"
//         placeholder="Type a message..."
//       />
//     </form>
//   );
// }
