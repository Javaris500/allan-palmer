import Link from "next/link";
import { ArrowLeft, ExternalLink, Music, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  SONG_GENRE_KEYS,
  SONG_GENRE_LABELS,
  isSongGenre,
  type SongGenre,
} from "@/lib/songs/genres";
import { RECENTLY_ADDED_WINDOW_DAYS } from "@/lib/songs/defaults";
import { SongForm } from "@/components/admin/repertoire/song-form";
import { deleteSong } from "./actions";

// Admin-only, always live — never prerender.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Repertoire | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminRepertoirePage() {
  const songs = await prisma.song.findMany({
    where: { deletedAt: null },
    orderBy: [{ title: "asc" }, { displayOrder: "asc" }],
    select: {
      id: true,
      title: true,
      artist: true,
      genres: true,
      displayOrder: true,
      createdAt: true,
    },
  });

  const recentCutoff = new Date();
  recentCutoff.setDate(recentCutoff.getDate() - RECENTLY_ADDED_WINDOW_DAYS);

  // Group by first letter for the list view.
  const grouped = new Map<string, typeof songs>();
  for (const s of songs) {
    const letter = (s.title[0] ?? "#").toUpperCase();
    const arr = grouped.get(letter) ?? [];
    arr.push(s);
    grouped.set(letter, arr);
  }
  const letters = Array.from(grouped.keys()).sort();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors mb-3"
          >
            <ArrowLeft className="h-3 w-3" />
            Admin dashboard
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold">
                  Repertoire
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and remove songs from the public catalog. Changes
                  appear on{" "}
                  <Link
                    href="/repertoire"
                    target="_blank"
                    rel="noopener"
                    className="text-gold hover:underline inline-flex items-center gap-1"
                  >
                    /repertoire <ExternalLink className="h-3 w-3" />
                  </Link>{" "}
                  within seconds.
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-10">
        <section className="rounded-xl border border-border/50 bg-card/30 p-6">
          <header className="mb-5">
            <h2 className="font-serif text-lg font-bold">Add a song</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Songs added here appear on /repertoire immediately. New songs
              show a "New" badge for {RECENTLY_ADDED_WINDOW_DAYS} days.
            </p>
          </header>
          <SongForm mode="create" />
        </section>

        <section>
          <header className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-serif text-lg font-bold">Catalog</h2>
          </header>

          {songs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/50 bg-card/20 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No songs in the catalog yet. Add one above to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/30 text-left">
                    <th className="p-3 font-medium text-muted-foreground w-10" />
                    <th className="p-3 font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="p-3 font-medium text-muted-foreground hidden md:table-cell">
                      Artist
                    </th>
                    <th className="p-3 font-medium text-muted-foreground hidden lg:table-cell">
                      Genres
                    </th>
                    <th className="p-3 font-medium text-muted-foreground w-28" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {letters.map((letter) =>
                    (grouped.get(letter) ?? []).map((song, idx) => {
                      const isFirstOfLetter = idx === 0;
                      const recent = song.createdAt > recentCutoff;
                      const validGenres = song.genres.filter(isSongGenre) as SongGenre[];
                      return (
                        <tr
                          key={song.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-3 align-top">
                            {isFirstOfLetter && (
                              <span className="font-serif text-lg text-gold/70">
                                {letter}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{song.title}</span>
                              {recent && (
                                <span className="text-[9px] tracking-[0.18em] uppercase font-medium text-gold/90 border border-gold/40 bg-gold/5 px-1.5 py-[1px] rounded-sm">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground md:hidden mt-0.5">
                              {song.artist ?? "—"}
                            </p>
                          </td>
                          <td className="p-3 text-muted-foreground hidden md:table-cell">
                            {song.artist ?? "—"}
                          </td>
                          <td className="p-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {validGenres.length === 0 ? (
                                <span className="text-xs text-muted-foreground/60">
                                  —
                                </span>
                              ) : (
                                validGenres.map((g) => (
                                  <span
                                    key={g}
                                    className="text-[10px] uppercase tracking-wider bg-muted/40 text-muted-foreground px-1.5 py-0.5 rounded-sm"
                                  >
                                    {SONG_GENRE_LABELS[g]}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            <Link
                              href={`/admin/repertoire/${song.id}`}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-muted/40 transition-colors"
                              aria-label={`Edit ${song.title}`}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Link>
                            <form
                              action={deleteSong}
                              className="inline-block ml-1"
                            >
                              <input type="hidden" name="id" value={song.id} />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                                aria-label={`Delete ${song.title}`}
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground/70 mt-3">
            Available genre keys: {SONG_GENRE_KEYS.map((g) => SONG_GENRE_LABELS[g]).join(" · ")}
          </p>
        </section>
      </div>
    </div>
  );
}
