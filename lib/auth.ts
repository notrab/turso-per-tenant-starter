import { cookies } from "next/headers";

export function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;
  return userId ? parseInt(userId, 10) : null;
}

export function setCurrentUser(userId: number) {
  cookies().set("userId", userId.toString(), { httpOnly: true, secure: true });
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

export function getWorkspaces() {
  const workspaces = cookies().get("workspaces")?.value;
  return workspaces ? JSON.parse(workspaces) : [];
}

export function addWorkspace(workspaceId: string) {
  const workspaces = getWorkspaces();
  if (!workspaces.includes(workspaceId)) {
    workspaces.push(workspaceId);
    cookies().set("workspaces", JSON.stringify(workspaces), {
      httpOnly: true,
      secure: true,
    });
  }
}

export function isLoggedIn() {
  return !!getCurrentUser();
}
