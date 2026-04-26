import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";
import { rateLimitMediaUpload } from "@/lib/rate-limit";

export async function POST(request: Request): Promise<NextResponse> {
  // Token issuance is gated by admin session — no token leaves the server
  // unless the caller is signed in as ADMIN.
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const limit = await rateLimitMediaUpload(session.user.id);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many uploads. Try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((limit.resetTime - Date.now()) / 1000),
          ).toString(),
        },
      },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        // Server-side allowlist — Blob will reject any other type
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/avif",
        ],
        // 10 MB cap per file; gallery photos shouldn't be huge
        maximumSizeInBytes: 10 * 1024 * 1024,
        addRandomSuffix: true,
        // Stamp the uploader so onUploadCompleted (production) knows who did it
        tokenPayload: JSON.stringify({ userId: session.user.id }),
      }),
      onUploadCompleted: async () => {
        // Not the primary integration point in this app. After @vercel/blob
        // `upload()` resolves on the client, the browser calls registerPhoto()
        // server action which is where the DB row + sharp validation happen.
        // This callback would also fire in production via Vercel Blob's
        // outbound webhook — left as a no-op so we don't double-write.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
