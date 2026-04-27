"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSong, updateSong } from "@/app/admin/repertoire/actions";
import {
  SONG_GENRE_KEYS,
  SONG_GENRE_LABELS,
  type SongGenre,
} from "@/lib/songs/genres";

type Initial = {
  title: string;
  artist: string;
  genres: SongGenre[];
  displayOrder: number;
};

type Props =
  | { mode: "create"; id?: never; initial?: Partial<Initial> }
  | { mode: "edit"; id: string; initial: Initial };

export function SongForm(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const initial: Initial = {
    title: props.initial?.title ?? "",
    artist: props.initial?.artist ?? "",
    genres: props.initial?.genres ?? [],
    displayOrder: props.initial?.displayOrder ?? 0,
  };

  const [genres, setGenres] = useState<SongGenre[]>(initial.genres);

  const toggleGenre = (g: SongGenre) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  return (
    <form
      className="space-y-5 rounded-lg border border-border/50 bg-card/30 p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSaved(false);

        if (genres.length === 0) {
          setError("Pick at least one genre.");
          return;
        }

        setSaving(true);
        const fd = new FormData(e.currentTarget);
        const title = String(fd.get("title") ?? "").trim();
        const artist = String(fd.get("artist") ?? "").trim();
        const displayOrderRaw = String(fd.get("displayOrder") ?? "0");
        const displayOrder = Number(displayOrderRaw) || 0;

        try {
          if (props.mode === "create") {
            await createSong({
              title,
              artist: artist || undefined,
              genres,
              displayOrder,
            });
            setSaved(true);
            (e.target as HTMLFormElement).reset();
            setGenres([]);
            startTransition(() => router.refresh());
          } else {
            await updateSong({
              id: props.id,
              title,
              artist,
              genres,
              displayOrder,
            });
            setSaved(true);
            startTransition(() => router.refresh());
          }
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
          maxLength={200}
          defaultValue={initial.title}
          placeholder="e.g. Canon in D"
          className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </Field>

      <Field label="Artist / composer (optional)">
        <input
          name="artist"
          maxLength={200}
          defaultValue={initial.artist}
          placeholder="e.g. Johann Pachelbel"
          className="w-full bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </Field>

      <Field label="Genres (pick all that fit — used for filtering)">
        <div className="flex flex-wrap gap-2 pt-1">
          {SONG_GENRE_KEYS.map((g) => {
            const active = genres.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                aria-pressed={active}
                className={
                  "text-xs px-3 py-1.5 rounded-full border transition-colors " +
                  (active
                    ? "bg-gold/20 border-gold text-gold"
                    : "border-border/60 text-muted-foreground hover:border-gold/60 hover:text-foreground")
                }
              >
                {SONG_GENRE_LABELS[g]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Display order (lower = earlier in the list)">
        <input
          name="displayOrder"
          type="number"
          min={0}
          max={99999}
          defaultValue={initial.displayOrder}
          className="w-40 bg-transparent border border-border/60 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || pending}
          className="inline-flex items-center gap-2 bg-gold text-gray-950 text-xs uppercase tracking-[0.2em] font-semibold px-5 py-2.5 hover:bg-gold/90 disabled:opacity-60 disabled:cursor-wait transition-all"
        >
          {(saving || pending) && <Loader2 className="h-3 w-3 animate-spin" />}
          {props.mode === "create" ? "Add song" : "Save changes"}
        </button>
        {saved && !saving && (
          <span className="text-xs text-emerald-400">
            {props.mode === "create" ? "Added." : "Saved."}
          </span>
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
