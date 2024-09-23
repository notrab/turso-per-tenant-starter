import Link from "next/link";

import { getUserWorkspaces } from "@/lib/auth";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";

export function Sidebar({ currentWorkspace }: { currentWorkspace: string }) {
  const userWorkspaces = getUserWorkspaces();

  return (
    <div className="w-16 bg-[#043134] text-white px-2 py-4 flex flex-col items-center overflow-y-auto">
      <WorkspaceSwitcher
        workspaces={userWorkspaces}
        currentWorkspace={currentWorkspace}
      />

      <Link
        href="/"
        className="w-10 h-10 rounded bg-white text-[#126F4C] flex items-center justify-center flex-shrink-0"
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
