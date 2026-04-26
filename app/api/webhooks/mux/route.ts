import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { mux, MUX_WEBHOOK_SECRET } from "@/lib/mux";
import { prisma } from "@/lib/prisma";
import { MEDIA_TAGS, PUBLIC_VIDEO_PAGES } from "@/lib/media/cache-tags";

export const runtime = "nodejs";

/**
 * Mux webhook handler.
 *
 * Subscribed events (configure in Mux dashboard → Webhooks):
 *   - video.upload.asset_created   → links upload session to asset id
 *   - video.asset.ready             → asset is ready to play; pull duration + playback id
 *   - video.asset.errored           → mark our row as errored
 *
 * Signature verification uses MUX_WEBHOOK_SECRET. If unset, we accept the
 * request but log a warning — fine for local dev with a tunnel, refuse in
 * production via the env check below.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("mux-signature");

  if (!MUX_WEBHOOK_SECRET) {
    console.error("[mux.webhook] MUX_WEBHOOK_SECRET is not set — refusing");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  try {
    await mux.webhooks.verifySignature(
      rawBody,
      { "mux-signature": signature ?? "" },
      MUX_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = event.data as {
    id?: string;
    upload_id?: string;
    asset_id?: string;
    playback_ids?: { id: string; policy: string }[];
    duration?: number;
    status?: string;
  };

  switch (event.type) {
    case "video.upload.asset_created": {
      const uploadId = data.id;
      const assetId = data.asset_id;
      if (uploadId && assetId) {
        await prisma.video.updateMany({
          where: { muxUploadId: uploadId },
          data: { muxAssetId: assetId },
        });
      }
      break;
    }

    case "video.asset.ready": {
      const assetId = data.id;
      const playbackId =
        data.playback_ids?.find((p) => p.policy === "public")?.id ??
        data.playback_ids?.[0]?.id ??
        null;
      if (assetId && playbackId) {
        await prisma.video.updateMany({
          where: { muxAssetId: assetId },
          data: {
            muxPlaybackId: playbackId,
            muxStatus: "ready",
            durationSec: data.duration ? Math.round(data.duration) : undefined,
          },
        });
      }
      break;
    }

    case "video.asset.errored": {
      const assetId = data.id;
      if (assetId) {
        await prisma.video.updateMany({
          where: { muxAssetId: assetId },
          data: { muxStatus: "errored" },
        });
      }
      break;
    }

    default:
      // Other events (deleted, updated, etc.) are ignored for now.
      break;
  }

  revalidateTag(MEDIA_TAGS.videos);
  for (const path of PUBLIC_VIDEO_PAGES) revalidatePath(path);
  revalidatePath("/admin/media");

  return NextResponse.json({ ok: true });
}
