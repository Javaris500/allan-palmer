"use client";

import { useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  registerPhoto,
  type RegisterPhotoInput,
} from "@/app/admin/media/actions";
import type { PhotoPlacement } from "@/generated/prisma";

type Props = {
  placement: PhotoPlacement;
  placementLabel: string;
  /** When true, shows compact "Replace" copy because there is already a
   *  photo in this slot. */
  isReplace?: boolean;
};

// file.type is occasionally empty on Safari/iOS — fall back to extension
// so the server-action Zod schema (contentType.min(1)) doesn't reject.
function inferContentType(file: File): string {
  if (file.type && file.type.length > 0) return file.type;
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  if (ext === "heic" || ext === "heif") return "image/heic";
  return "image/jpeg";
}

async function reportFailure(payload: {
  stage: "blob_upload" | "register" | "unknown";
  message: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  placement?: string;
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

export function PhotoUploader({ placement, placementLabel, isReplace }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const inputId = `photo-upload-${placement}`;

  async function onFile(file: File, form: HTMLFormElement) {
    setError(null);
    setSuccess(null);
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
      console.error("[photo-uploader] blob upload failed", err);
      setProgress(null);
      setError(`Upload to storage failed: ${message}`);
      void reportFailure({
        stage: "blob_upload",
        message,
        fileName: file.name,
        fileSize: file.size,
        fileType: contentType,
        placement,
      });
      return;
    }

    const fd = new FormData(form);
    const title =
      String(fd.get("title") ?? "").trim() ||
      file.name.replace(/\.[^.]+$/, "");
    const altText =
      String(fd.get("altText") ?? "").trim() || `Allan Palmer — ${title}`;

    const input: RegisterPhotoInput = {
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      contentType,
      sizeBytes: file.size,
      title,
      altText,
      placement,
    };

    try {
      await registerPhoto(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      console.error("[photo-uploader] registerPhoto failed", err);
      setProgress(null);
      setError(`Saving photo failed: ${message}`);
      void reportFailure({
        stage: "register",
        message,
        fileName: file.name,
        fileSize: file.size,
        fileType: contentType,
        placement,
      });
      return;
    }

    form.reset();
    setProgress(null);
    setSuccess(`Uploaded "${title}" — appears on the public site within a few seconds.`);
    startTransition(() => router.refresh());
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const file = fd.get("file") as File | null;
        if (!file || file.size === 0) {
          setError("Choose a file first.");
          return;
        }
        void onFile(file, e.currentTarget);
      }}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="title"
          placeholder="Title (optional)"
          maxLength={120}
          className="bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
        <input
          name="altText"
          placeholder="Alt text for accessibility (optional)"
          maxLength={240}
          className="bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="cursor-pointer inline-flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2 border border-border/60 rounded-md hover:border-gold/60 hover:text-gold transition-colors"
        >
          <Upload className="h-4 w-4" />
          Choose file
        </label>
        <input
          id={inputId}
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            const form = e.currentTarget.form;
            if (!f || !form) return;
            void onFile(f, form);
          }}
        />
        <span className="text-xs text-muted-foreground">
          {isReplace
            ? `Replaces current ${placementLabel.toLowerCase()} photo`
            : `Uploads to ${placementLabel}`}
        </span>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-gold" />}
      </div>

      {progress !== null && (
        <div className="h-1 bg-border/40 rounded overflow-hidden">
          <div
            className="h-full bg-gold transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Upload failed</p>
            <p className="mt-0.5 break-words">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <p role="status" className="text-xs text-emerald-600">
          {success}
        </p>
      )}
    </form>
  );
}
