import Link from "next/link";

import { fetchWorkspaces } from "../lib/actions";

export default async function HomePage() {
  const workspaces = await fetchWorkspaces();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Select a Workspace</h1>
      {workspaces.length > 0 ? (
        <ul>
          {workspaces.map((workspace: string) => (
            <li key={workspace} className="mb-2">
              <Link
                href={`/workspaces/${workspace}`}
                className="text-blue-500 hover:underline"
              >
                {workspace}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You don&apo;t have any workspaces yet.</p>
      )}
      <Link
        href="/create-workspace"
        className="mt-4 inline-block bg-[#0E1F22] text-white px-4 py-2 rounded"
      >
        Create New Workspace
      </Link>
    </div>
  );
}
