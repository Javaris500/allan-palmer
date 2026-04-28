"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import {
  Trash2,
  Pencil,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  deletePhoto,
  replacePhotoBlob,
  type ReplacePhotoBlobInput,
} from "@/app/admin/media/actions";

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

function inferContentType(file: File): string {
  if (file.type && file.type.length > 0) return file.type;
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
}

async function reportFailure(payload: {
  stage: "blob_upload" | "register" | "unknown";
  message: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}) {
  try {
    await fetch("/api/admin/media/upload-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      }),
    });
  } catch {
    // Logging the logging failure is not useful.
  }
}

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
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function onReplace(file: File) {
    setError(null);
    setBusy(true);
    setProgress(0);

    const contentType = inferContentType(file);

    let blob;
    try {
      blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/media/photo-upload",
        contentType,
        onUploadProgress: (e) => setProgress(Math.round(e.percentage)),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setBusy(false);
      setProgress(null);
      setError(`Upload to storage failed: ${message}`);
      void reportFailure({
        stage: "blob_upload",
        message,
        fileName: file.name,
        fileSize: file.size,
        fileType: contentType,
      });
      return;
    }

    const input: ReplacePhotoBlobInput = {
      id,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      contentType,
      sizeBytes: file.size,
    };

    try {
      await replacePhotoBlob(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Replace failed";
      setBusy(false);
      setProgress(null);
      setError(`Saving replacement failed: ${message}`);
      void reportFailure({
        stage: "register",
        message,
        fileName: file.name,
        fileSize: file.size,
        fileType: contentType,
      });
      return;
    }

    setBusy(false);
    setProgress(null);
    startTransition(() => router.refresh());
  }

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
        {(busy || progress !== null) && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-gold" />
            {progress !== null && (
              <div className="w-3/4 h-1 bg-border/40 rounded overflow-hidden">
                <div
                  className="h-full bg-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Replacing…
            </span>
          </div>
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

        <div className="flex items-center gap-1 pt-2 flex-wrap">
          <Link
            href={`/admin/media/photos/${id}`}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
            aria-label="Edit photo details"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy || pending}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors disabled:opacity-50"
            aria-label="Replace photo file"
          >
            <RefreshCw className="h-3 w-3" />
            Replace
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              if (!f) return;
              void onReplace(f);
              // Reset so picking the same filename twice still triggers
              e.currentTarget.value = "";
            }}
          />
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
              disabled={busy || pending}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              aria-label="Delete photo"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </form>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1.5 text-[11px] text-destructive mt-2"
          >
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}

        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 pt-1">
          {placementLabel}
        </p>
      </div>
    </div>
  );
}
