"use client";

import { useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, Loader2 } from "lucide-react";
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

export function PhotoUploader({ placement, placementLabel, isReplace }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const inputId = `photo-upload-${placement}`;

  async function onFile(file: File, form: HTMLFormElement) {
    setError(null);
    setProgress(0);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/media/photo-upload",
        onUploadProgress: (e) => setProgress(Math.round(e.percentage)),
      });

      const fd = new FormData(form);
      const title =
        String(fd.get("title") ?? "").trim() ||
        file.name.replace(/\.[^.]+$/, "");
      const altText =
        String(fd.get("altText") ?? "").trim() || `Allan Palmer — ${title}`;

      const input: RegisterPhotoInput = {
        blobUrl: blob.url,
        blobPathname: blob.pathname,
        contentType: file.type,
        sizeBytes: file.size,
        title,
        altText,
        placement,
      };

      await registerPhoto(input);
      form.reset();
      setProgress(null);
      startTransition(() => router.refresh());
    } catch (err) {
      setProgress(null);
      setError(err instanceof Error ? err.message : "Upload failed");
    }
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
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
