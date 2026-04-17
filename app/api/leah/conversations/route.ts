import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMode } from "@/lib/leah/auth";
import { listUserConversations } from "@/lib/leah/memory";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = getMode(session);
  const conversations = await listUserConversations(session.user.id, mode);
  return NextResponse.json({ conversations });
}
