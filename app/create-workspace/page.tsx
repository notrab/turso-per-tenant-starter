"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/lib/actions";

export default function CreateWorkspace() {
  const [workspaceId, setWorkspaceId] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createWorkspace(workspaceId);
    if (result.success) {
      router.push(`/workspaces/${workspaceId}/login`);
    } else {
      alert("Failed to create workspace. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Workspace</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          placeholder="Enter workspace ID"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Workspace
        </button>
      </form>
    </div>
  );
}
