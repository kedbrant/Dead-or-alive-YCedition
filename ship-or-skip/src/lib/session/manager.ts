import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ship-or-skip-session";

/**
 * Gets the session ID from cookies (server-side, read-only).
 * Returns null if no session exists.
 *
 * @returns The session ID string or null
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);
  return existingSession?.value ?? null;
}
