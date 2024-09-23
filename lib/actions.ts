"use server";

import { getDbClient } from "./db";

import {
  setCurrentUser,
  setCurrentWorkspace,
  addUserWorkspace,
  logoutFromWorkspace,
  getCurrentUser,
} from "./auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function switchWorkspace(workspaceId: string) {
  setCurrentWorkspace(workspaceId);
  return { success: true };
}

// export async function createWorkspace(workspaceId: string) {
//   addWorkspace(workspaceId);
//   setCurrentWorkspace(workspaceId);
//   return { success: true };
// }

export async function createMessage(
  workspaceId: string,
  channelId: number,
  content: string,
) {
  const userId = getCurrentUser(workspaceId);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const db = getDbClient(workspaceId);
  await db.execute({
    sql: "INSERT INTO messages (channel_id, user_id, content) VALUES (?, ?, ?)",
    args: [channelId, userId, content],
  });

  revalidatePath(`/workspaces/${workspaceId}/channels/${channelId}`);

  return { success: true };
}

export async function loginUser(workspaceId: string, username: string) {
  const db = getDbClient(workspaceId);

  // Check if the user exists in this workspace
  const result = await db.execute({
    sql: "SELECT id FROM users WHERE username = ?",
    args: [username],
  });

  let userId;
  if (result.rows.length === 0) {
    // User doesn't exist in this workspace, create a new user
    const insertResult = await db.execute({
      sql: "INSERT INTO users (username) VALUES (?)",
      args: [username],
    });
    userId = insertResult.lastInsertRowid;
  } else {
    userId = result.rows[0].id;
  }

  if (!userId) {
    return { success: false };
  }

  // Set the user ID and workspace ID in cookies
  cookies().set("userId", userId.toString(), { httpOnly: true, secure: true });
  cookies().set("currentWorkspace", workspaceId, {
    httpOnly: true,
    secure: true,
  });

  // Add this workspace to the user's list of workspaces
  const workspaces = JSON.parse(cookies().get("workspaces")?.value || "[]");
  if (!workspaces.includes(workspaceId)) {
    workspaces.push(workspaceId);
    cookies().set("workspaces", JSON.stringify(workspaces), {
      httpOnly: true,
      secure: true,
    });
  }

  if (userId) {
    // @ts-expect-error "userId" type
    setCurrentUser(workspaceId, userId);
    setCurrentWorkspace(workspaceId);
    addUserWorkspace(workspaceId);

    revalidatePath(`/workspaces/${workspaceId}`);

    return { success: true };
  }

  return { success: false };
}

export async function fetchWorkspaces() {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${process.env.TURSO_ORG}/databases?schema=${process.env.TURSO_DATABASE_NAME}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  const data = await response.json();
  return data.databases.map((db: { Name: string }) => db.Name);
}

export async function createWorkspace(name: string) {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${process.env.TURSO_ORG}/databases`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        schema: process.env.TURSO_DATABASE_NAME,
        group: "default",
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create workspace");
  }

  return { success: true };
}

export async function fetchChannels(workspaceId: string) {
  const db = getDbClient(workspaceId);
  const result = await db.execute("SELECT id, name FROM channels");
  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
  }));
}

export async function fetchUsers(workspaceId: string) {
  const db = getDbClient(workspaceId);
  const result = await db.execute("SELECT id, username FROM users");
  return result.rows as unknown as Array<{ id: number; username: string }>;
}

export async function createChannel(workspaceId: string, channelName: string) {
  const db = getDbClient(workspaceId);
  try {
    const result = await db.execute({
      sql: "INSERT INTO channels (name) VALUES (?) RETURNING id",
      args: [channelName],
    });

    revalidatePath(`/workspaces/${workspaceId}`);
    revalidatePath(`/workspaces/${workspaceId}/channels/${result.rows[0].id}`);

    return { success: true, channelId: result.rows[0].id };
  } catch (error) {
    console.error("Failed to create channel:", error);
    return { success: false };
  }
}

export async function createDirectMessage(
  workspaceId: string,
  recipientId: number,
  content: string,
) {
  const userId = getCurrentUser(workspaceId);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const db = getDbClient(workspaceId);
  await db.execute({
    sql: "INSERT INTO direct_messages (sender_id, recipient_id, content) VALUES (?, ?, ?)",
    args: [userId, recipientId, content],
  });
  revalidatePath(`/workspaces/${workspaceId}/dm/${recipientId}`);
  return { success: true };
}

export async function fetchDirectMessages(
  workspaceId: string,
  otherUserId: number,
) {
  const currentUserId = getCurrentUser(workspaceId);
  if (!currentUserId) {
    throw new Error("Unauthorized");
  }

  const db = getDbClient(workspaceId);
  const result = await db.execute({
    sql: `
      SELECT
        dm.*,
        sender.username as sender_username,
        sender.display_name as sender_display_name,
        recipient.username as recipient_username,
        recipient.display_name as recipient_display_name
      FROM direct_messages dm
      JOIN users sender ON dm.sender_id = sender.id
      JOIN users recipient ON dm.recipient_id = recipient.id
      WHERE (dm.sender_id = ? AND dm.recipient_id = ?) OR (dm.sender_id = ? AND dm.recipient_id = ?)
      ORDER BY dm.created_at DESC
      LIMIT 50
    `,
    args: [currentUserId, otherUserId, otherUserId, currentUserId],
  });

  return result.rows;
}

export async function logoutUser(workspaceId: string) {
  logoutFromWorkspace(workspaceId);
  revalidatePath(`/workspaces/${workspaceId}`);
  return { success: true };
}
