"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/actions";

export function LogoutButton({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser(workspaceId);
    router.push(`/workspaces/${workspaceId}/login`);
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
}
