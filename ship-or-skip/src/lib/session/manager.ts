import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ship-or-skip-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Gets or creates a session ID.
 * Creates a new session if one doesn't exist.
 *
 * @returns The session ID string
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);

  if (existingSession?.value) {
    return existingSession.value;
  }

  // Create new session
  const newSessionId = crypto.randomUUID();

  cookieStore.set(SESSION_COOKIE_NAME, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return newSessionId;
}
