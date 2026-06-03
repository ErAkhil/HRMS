import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/notifications/pending
 * Get pending notifications for offline sync
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch pending notifications from database
    // Placeholder response
    return NextResponse.json([
      {
        title: "Leave Approved",
        body: "Your leave request for May 20-24 has been approved",
        tag: "leave-approval",
        data: { url: "/leave" },
      },
    ]);
  } catch (error) {
    console.error("Pending notifications error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
