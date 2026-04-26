import Link from "next/link";
import { Trash2, Pencil, ExternalLink } from "lucide-react";
import { deletePhoto } from "@/app/admin/media/actions";

type PhotoCardProps = {
  id: string;
  title: string;
  altText: string;
  blobUrl: string;
  width: number | null;
  height: number | null;
  placementLabel: string;
  viewUrl: string;
  featured: boolean;
};

export function PhotoCard({
  id,
  title,
  altText,
  blobUrl,
  width,
  height,
  placementLabel,
  viewUrl,
  featured,
}: PhotoCardProps) {
  return (
    <div className="group relative rounded-lg overflow-hidden border border-border/40 bg-card/30 hover:border-gold/40 transition-colors">
      <div className="aspect-[4/3] bg-muted/30 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={blobUrl}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {featured && (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-gold/90 text-black px-2 py-0.5 rounded-sm font-medium">
            Featured
          </span>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <p className="text-sm font-medium truncate" title={title}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground truncate" title={altText}>
          {altText}
        </p>
        {width && height && (
          <p className="text-[10px] text-muted-foreground/70">
            {width}×{height}
          </p>
        )}

        <div className="flex items-center gap-1 pt-2">
          <Link
            href={`/admin/media/photos/${id}`}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
            aria-label="Edit photo details"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
          {viewUrl && (
            <Link
              href={viewUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
              aria-label="View on site"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </Link>
          )}
          <form action={deletePhoto} className="ml-auto">
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Delete photo"
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
