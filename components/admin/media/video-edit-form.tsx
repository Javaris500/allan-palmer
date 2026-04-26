"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateVideo } from "@/app/admin/media/video-actions";
import {
  VIDEO_PLACEMENTS,
  VIDEO_PLACEMENT_ORDER,
} from "@/lib/media/placements";
import { VideoCategory, VideoPlacement } from "@/generated/prisma";

const CATEGORIES = Object.values(VideoCategory);

type Initial = {
  title: string;
  description: string;
  category: VideoCategory;
  placement: VideoPlacement;
  featured: boolean;
  displayOrder: number;
  thumbnailTime: number;
};

export function VideoEditForm({
  id,
  initial,
}: {
  id: string;
  initial: Initial;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-5 rounded-lg border border-border/50 bg-card/30 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSaved(false);
        setSaving(true);
        const fd = new FormData(e.currentTarget);
        try {
          await updateVideo({
            id,
            title: String(fd.get("title") ?? "").trim(),
            description: String(fd.get("description") ?? ""),
            category: fd.get("category") as VideoCategory,
            placement: fd.get("placement") as VideoPlacement,
            featured: fd.get("featured") === "on",
            displayOrder: Number(fd.get("displayOrder") ?? 0),
            thumbnailTime: Number(fd.get("thumbnailTime") ?? 8),
          });
          setSaved(true);
          startTransition(() => router.refresh());
        } catch (err) {
          setError(err instanceof Error ? err.message : "Save failed");
        } finally {
          setSaving(false);
        }
      }}
    >
      <Field label="Title">
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={initial.title}
          className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </Field>

      <Field label="Description (optional)">
        <textarea
          name="description"
          maxLength={800}
          rows={3}
          defaultValue={initial.description}
          className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Where it appears (placement)">
          <select
            name="placement"
            defaultValue={initial.placement}
            className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          >
            {VIDEO_PLACEMENT_ORDER.map((p) => (
              <option key={p} value={p}>
                {VIDEO_PLACEMENTS[p].label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category">
          <select
            name="category"
            defaultValue={initial.category}
            className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c[0] + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Display order">
          <input
            name="displayOrder"
            type="number"
            min={0}
            max={9999}
            defaultValue={initial.displayOrder}
            className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </Field>

        <Field label="Thumbnail at (seconds)">
          <input
            name="thumbnailTime"
            type="number"
            min={0}
            max={3600}
            defaultValue={initial.thumbnailTime}
            className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </Field>

        <label className="flex items-center gap-2 mt-7 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initial.featured}
            className="accent-gold"
          />
          Featured
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || pending}
          className="inline-flex items-center gap-2 bg-gold text-gray-950 text-xs uppercase tracking-[0.2em] font-semibold px-5 py-2.5 hover:bg-gold/90 disabled:opacity-60 disabled:cursor-wait transition-all"
        >
          {(saving || pending) && <Loader2 className="h-3 w-3 animate-spin" />}
          Save changes
        </button>
        {saved && !saving && (
          <span className="text-xs text-emerald-400">Saved.</span>
        )}
        {error && (
          <span role="alert" className="text-xs text-destructive">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 font-medium mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
