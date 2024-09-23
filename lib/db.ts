import { createClient } from "@libsql/client";

export function getDbClient(workspaceId: string) {
  return createClient({
    url: `libsql://${workspaceId}-${process.env.TURSO_ORG}.turso.io`,
    authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
  });
}
