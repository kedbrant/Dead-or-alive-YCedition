import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "ship-or-skip-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Check if session cookie already exists
  const existingSession = request.cookies.get(SESSION_COOKIE_NAME);

  if (!existingSession?.value) {
    // Create new session ID
    const newSessionId = crypto.randomUUID();

    response.cookies.set(SESSION_COOKIE_NAME, newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  }

  return response;
}

// Only run proxy on pages that need sessions
export const config = {
  matcher: ["/vote", "/pitch/:path*"],
};
