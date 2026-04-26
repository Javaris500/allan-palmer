import Link from "next/link";
import { Trash2, Pencil, ExternalLink, RotateCw, Clock } from "lucide-react";
import {
  deleteVideo,
  refreshVideoStatus,
} from "@/app/admin/media/video-actions";

type VideoCardProps = {
  id: string;
  title: string;
  muxPlaybackId: string | null;
  muxStatus: string;
  durationSec: number | null;
  thumbnailTime: number;
  placementLabel: string;
  viewUrl: string;
  featured: boolean;
  createdAt: Date;
};

function formatDuration(sec: number | null): string {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoCard({
  id,
  title,
  muxPlaybackId,
  muxStatus,
  durationSec,
  thumbnailTime,
  placementLabel,
  viewUrl,
  featured,
  createdAt,
}: VideoCardProps) {
  const isReady = muxStatus === "ready" && muxPlaybackId;
  const isErrored = muxStatus === "errored";
  const isPreparing = !isReady && !isErrored;

  const thumbUrl = muxPlaybackId
    ? `https://image.mux.com/${muxPlaybackId}/thumbnail.png?width=480&time=${thumbnailTime}`
    : null;

  return (
    <div className="group relative rounded-lg overflow-hidden border border-border/40 bg-card/30 hover:border-gold/40 transition-colors">
      <div className="aspect-video bg-muted/30 relative">
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            {isPreparing && (
              <span className="flex items-center gap-2">
                <Clock className="h-3 w-3 animate-pulse" />
                Encoding on Mux…
              </span>
            )}
            {isErrored && (
              <span className="text-destructive">Encoding failed</span>
            )}
          </div>
        )}

        {featured && (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-gold/90 text-black px-2 py-0.5 rounded-sm font-medium">
            Featured
          </span>
        )}
        {durationSec && (
          <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-mono">
            {formatDuration(durationSec)}
          </span>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <p className="text-sm font-medium truncate" title={title}>
          {title}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {isReady ? (
            <span className="text-emerald-400">Ready</span>
          ) : isErrored ? (
            <span className="text-destructive">Errored</span>
          ) : (
            <span className="text-amber-400">Processing</span>
          )}
          {" · "}
          uploaded {createdAt.toLocaleDateString()}
        </p>

        <div className="flex items-center gap-1 pt-2 flex-wrap">
          {isPreparing && (
            <form action={refreshVideoStatus}>
              <input type="hidden" name="id" value={id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
                aria-label="Check Mux status"
                title="Poll Mux for current status"
              >
                <RotateCw className="h-3 w-3" />
                Refresh
              </button>
            </form>
          )}
          <Link
            href={`/admin/media/videos/${id}`}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
          {viewUrl && isReady && (
            <Link
              href={viewUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </Link>
          )}
          <form action={deleteVideo} className="ml-auto">
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </form>
        </div>

        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 pt-1">
          {placementLabel}
        </p>
      </div>
    </div>
  );
}
