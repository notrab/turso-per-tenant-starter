import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/workspaces/")) {
    const pathParts = path.split("/");
    const workspaceId = pathParts[2];
    const userId = request.cookies.get(`userId_${workspaceId}`)?.value;

    if (!userId && workspaceId && !path.endsWith("/login")) {
      return NextResponse.redirect(
        new URL(`/workspaces/${workspaceId}/login`, request.url),
      );
    }

    if (userId && path.endsWith("/login")) {
      return NextResponse.redirect(
        new URL(`/workspaces/${workspaceId}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/workspaces/:workspaceId",
    "/workspaces/:workspaceId/login",
    "/workspaces/:workspaceId/channels/:channelId*",
    "/workspaces/:workspaceId/dm/:userId*",
  ],
};
