import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ship-or-skip-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Generates a UUID v4 session ID
 */
function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Gets the existing session ID from cookies or creates a new one.
 * For use in Server Components and Route Handlers.
 *
 * @returns The session ID string
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);

  if (existingSession?.value) {
    return existingSession.value;
  }

  const newSessionId = generateSessionId();

  cookieStore.set(SESSION_COOKIE_NAME, newSessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return newSessionId;
}

/**
 * Gets the current session ID without creating a new one.
 * Returns null if no session exists.
 *
 * @returns The session ID string or null
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get(SESSION_COOKIE_NAME);
  return existingSession?.value ?? null;
}
