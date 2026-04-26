"use client";

import { useState, useTransition } from "react";
import * as UpChunk from "@mux/upchunk";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createVideoUpload,
  type CreateUploadInput,
} from "@/app/admin/media/video-actions";
import type { VideoPlacement } from "@/generated/prisma";

type Props = {
  placement: VideoPlacement;
  placementLabel: string;
  isReplace?: boolean;
};

export function VideoUploader({
  placement,
  placementLabel,
  isReplace,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [progress, setProgress] = useState<number | null>(null);
  const [phase, setPhase] = useState<
    "idle" | "starting" | "uploading" | "processing" | "done" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const inputId = `video-upload-${placement}`;

  async function onFile(file: File, form: HTMLFormElement) {
    setError(null);
    setPhase("starting");
    setProgress(0);

    const fd = new FormData(form);
    const title =
      String(fd.get("title") ?? "").trim() ||
      file.name.replace(/\.[^.]+$/, "");
    const description = String(fd.get("description") ?? "").trim() || undefined;

    let muxUploadUrl: string;
    try {
      const input: CreateUploadInput = { title, description, placement };
      const result = await createVideoUpload(input);
      if (!result.muxUploadUrl) {
        throw new Error("Mux did not return an upload URL");
      }
      muxUploadUrl = result.muxUploadUrl;
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : "Failed to start upload");
      return;
    }

    setPhase("uploading");

    const upload = UpChunk.createUpload({
      endpoint: muxUploadUrl,
      file,
      chunkSize: 5120,
    });

    upload.on("progress", (e) => {
      const detail = e.detail as number;
      setProgress(Math.round(detail));
    });

    upload.on("error", (e) => {
      const detail = e.detail as { message?: string };
      setPhase("error");
      setError(detail.message ?? "Upload failed");
    });

    upload.on("success", () => {
      setPhase("processing");
      setProgress(null);
      form.reset();
      // Mux now needs ~30-60s to encode. Webhook will mark it ready in
      // prod; in local dev the admin UI's "Refresh status" button polls.
      startTransition(() => router.refresh());
      setTimeout(() => setPhase("done"), 800);
    });
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const file = fd.get("file") as File | null;
        if (!file || file.size === 0) {
          setError("Choose a video file first.");
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
          name="description"
          placeholder="Description (optional)"
          maxLength={400}
          className="bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <label
          htmlFor={inputId}
          className="cursor-pointer inline-flex items-center gap-2 text-xs uppercase tracking-wider px-4 py-2 border border-border/60 rounded-md hover:border-gold/60 hover:text-gold transition-colors"
        >
          <Upload className="h-4 w-4" />
          Choose video
        </label>
        <input
          id={inputId}
          name="file"
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
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
            ? `Replaces current ${placementLabel.toLowerCase()} video`
            : `Uploads to ${placementLabel}`}
        </span>
        {(phase === "starting" ||
          phase === "uploading" ||
          phase === "processing" ||
          pending) && (
          <Loader2 className="h-4 w-4 animate-spin text-gold" />
        )}
        {phase === "uploading" && (
          <span className="text-xs text-muted-foreground">
            Uploading to Mux…
          </span>
        )}
        {phase === "processing" && (
          <span className="text-xs text-muted-foreground">
            Mux is encoding (this takes ~30–60s)
          </span>
        )}
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
