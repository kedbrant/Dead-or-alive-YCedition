import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, twitter_handle } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!twitter_handle) {
      return NextResponse.json(
        { error: "Twitter handle is required" },
        { status: 400 }
      );
    }

    // Clean up the handle (remove @ if present)
    const cleanHandle = twitter_handle.replace(/^@/, "").trim();

    if (!cleanHandle) {
      return NextResponse.json(
        { error: "Invalid Twitter handle" },
        { status: 400 }
      );
    }

    // Upsert session with twitter handle
    const { error } = await supabase
      .from("sessions")
      .upsert(
        {
          id: session_id,
          twitter_handle: cleanHandle,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Error registering session:", error);
      return NextResponse.json(
        { error: "Failed to register" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, handle: cleanHandle });
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
