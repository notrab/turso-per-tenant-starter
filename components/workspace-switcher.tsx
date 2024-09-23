"use client";

import { useRouter } from "next/navigation";

type WorkspaceSwitcherProps = {
  workspaces: string[];
  currentWorkspace: string;
};

export function WorkspaceSwitcher({
  workspaces,
  currentWorkspace,
}: WorkspaceSwitcherProps) {
  const router = useRouter();

  const handleWorkspaceSwitch = (workspace: string) => {
    router.push(`/workspaces/${workspace}`);
  };

  return (
    <>
      {workspaces.map((workspace) => (
        <button
          key={workspace}
          onClick={() => handleWorkspaceSwitch(workspace)}
          className={`w-10 h-10 rounded flex items-center justify-center mb-4 ${
            workspace === currentWorkspace
              ? "border-2 border-[#126F4C] bg-[#126F4C] shadow-md font-medium"
              : "bg-white/10"
          }`}
        >
          {workspace.charAt(0).toUpperCase()}
        </button>
      ))}
    </>
  );
}
