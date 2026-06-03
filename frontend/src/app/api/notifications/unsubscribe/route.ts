import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/notifications/unsubscribe
 * Unsubscribe user from push notifications
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Logic for unsubscription would go here
    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Unsubscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
