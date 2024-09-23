import { cookies } from "next/headers";

export function getCurrentUser(workspaceId: string) {
  try {
    const cookieStore = cookies();
    const userIdCookie = cookieStore.get(`userId_${workspaceId}`)?.value;
    return userIdCookie ? parseInt(userIdCookie, 10) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(workspaceId: string, userId: number) {
  cookies().set(`userId_${workspaceId}`, userId.toString(), {
    httpOnly: true,
    secure: true,
  });
}

export function getCurrentWorkspace() {
  return cookies().get("currentWorkspace")?.value;
}

export function setCurrentWorkspace(workspaceId: string) {
  cookies().set("currentWorkspace", workspaceId, {
    httpOnly: true,
    secure: true,
  });
}

export function getUserWorkspaces(): string[] {
  try {
    const workspacesCookie = cookies().get("userWorkspaces")?.value;
    return workspacesCookie ? JSON.parse(workspacesCookie) : [];
  } catch {
    return [];
  }
}

export function addUserWorkspace(workspaceId: string) {
  const workspaces = getUserWorkspaces();
  if (!workspaces.includes(workspaceId)) {
    workspaces.push(workspaceId);
    cookies().set("userWorkspaces", JSON.stringify(workspaces), {
      httpOnly: true,
      secure: true,
    });
  }
}

export function isLoggedInToWorkspace(workspaceId: string) {
  return !!getCurrentUser(workspaceId);
}

export function logoutFromWorkspace(workspaceId: string) {
  cookies().delete(`userId_${workspaceId}`);

  // Remove the workspace from the user's list of workspaces
  const workspaces = getUserWorkspaces();
  const updatedWorkspaces = workspaces.filter((ws) => ws !== workspaceId);
  cookies().set("userWorkspaces", JSON.stringify(updatedWorkspaces), {
    httpOnly: true,
    secure: true,
  });

  // If the current workspace is the one we're logging out from, clear it
  if (getCurrentWorkspace() === workspaceId) {
    cookies().delete("currentWorkspace");
  }
}
