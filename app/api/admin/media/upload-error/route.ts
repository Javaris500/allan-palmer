import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Receives client-side upload failures (Blob `upload()` rejection,
// network errors, etc.) and writes them to admin_actions so we have a
// DB-level audit trail. Without this, browser-side failures vanish.
const bodySchema = z.object({
  stage: z.enum(["blob_upload", "register", "unknown"]),
  message: z.string().max(2000),
  fileName: z.string().max(500).optional(),
  fileSize: z.number().int().nonnegative().optional(),
  fileType: z.string().max(120).optional(),
  placement: z.string().max(60).optional(),
  userAgent: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await prisma.adminAction.create({
    data: {
      userId: session.user.id,
      action: `photo.upload_failed.${parsed.stage}`,
      metadata: {
        message: parsed.message,
        fileName: parsed.fileName,
        fileSize: parsed.fileSize,
        fileType: parsed.fileType,
        placement: parsed.placement,
        userAgent: parsed.userAgent,
      },
    },
  });

  return NextResponse.json({ logged: true });
}
