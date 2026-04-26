import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VIDEO_PLACEMENTS } from "@/lib/media/placements";
import { VideoEditForm } from "@/components/admin/media/video-edit-form";

export const metadata = {
  title: "Edit Video | Admin",
  robots: { index: false, follow: false },
};

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await prisma.video.findFirst({
    where: { id, deletedAt: null },
  });
  if (!video) notFound();

  const meta = VIDEO_PLACEMENTS[video.placement];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 max-w-3xl">
        <Link
          href="/admin/media"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          All media
        </Link>

        <h1 className="font-serif text-2xl font-bold mb-1">Edit video</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Currently appears on: <strong>{meta.appearsOn}</strong>
          {meta.viewUrl && (
            <Link
              href={meta.viewUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 ml-2 text-gold hover:underline"
            >
              View live <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </p>

        <div className="rounded-lg border border-border/50 bg-card/30 p-5 mb-5">
          {video.muxPlaybackId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://image.mux.com/${video.muxPlaybackId}/thumbnail.png?width=720&time=${video.thumbnailTime}`}
              alt={video.title}
              className="w-full rounded"
            />
          ) : (
            <div className="aspect-video bg-muted/30 rounded flex items-center justify-center text-sm text-muted-foreground">
              {video.muxStatus === "errored"
                ? "Encoding failed"
                : "Mux is still encoding…"}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3">
            Status: <strong className="capitalize">{video.muxStatus}</strong>
            {video.durationSec && (
              <> · {Math.round(video.durationSec)}s</>
            )}
            {video.muxPlaybackId && (
              <> · Mux ID: {video.muxPlaybackId}</>
            )}
          </p>
        </div>

        <VideoEditForm
          id={video.id}
          initial={{
            title: video.title,
            description: video.description ?? "",
            category: video.category,
            placement: video.placement,
            featured: video.featured,
            displayOrder: video.displayOrder,
            thumbnailTime: video.thumbnailTime,
          }}
        />
      </div>
    </div>
  );
}
