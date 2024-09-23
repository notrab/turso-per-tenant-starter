import Link from "next/link";

import { fetchWorkspaces } from "@/lib/actions";
import { WorkspaceSwitcher } from "./workspace-switcher";

export async function Sidebar({
  currentWorkspace,
}: {
  currentWorkspace: string;
}) {
  const workspaces = await fetchWorkspaces();

  return (
    <div className="w-16 bg-[#043134] text-white p-2 flex flex-col items-center">
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
      />

      <Link
        href="/create-workspace"
        className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mt-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
    </div>
  );
}
