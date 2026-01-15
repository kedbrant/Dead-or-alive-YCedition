import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ship-or-skip-session";

/**
 * Gets the session ID from cookies.
 * The session cookie is set by middleware, so it should always exist
 * on protected routes (/vote, /pitch/*).
 *
 * @returns The session ID string
 * @throws Error if no session exists (should not happen on protected routes)
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);

  if (!existingSession?.value) {
    throw new Error("No session found. Middleware should have created one.");
  }

  return existingSession.value;
}
