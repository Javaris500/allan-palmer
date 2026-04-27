import "server-only";
import { prisma } from "@/lib/prisma";
import { isSongGenre, type SongGenre } from "./genres";
import {
  defaultSongs,
  RECENTLY_ADDED_WINDOW_DAYS,
  type DefaultSong,
} from "./defaults";

export type PublicSong = {
  title: string;
  artist: string | null;
  genres: SongGenre[];
  recentlyAdded: boolean;
  audioId: string | null;
  audioUrl: string | null;
};

function fromDefault(song: DefaultSong): PublicSong {
  return {
    title: song.title,
    artist: song.artist ?? null,
    genres: song.genres,
    recentlyAdded: song.recentlyAdded === true,
    audioId: song.audioId ?? null,
    audioUrl: song.audioUrl ?? null,
  };
}

/**
 * Load the public song catalog.
 *
 * Reads from the Song table when available; falls back to the hardcoded
 * defaults if the DB is unreachable or empty so /repertoire never goes
 * blank during a database hiccup.
 */
export async function loadPublicSongs(): Promise<PublicSong[]> {
  try {
    // Title is the primary sort so newly-added songs slot in alphabetically
    // within their letter group on the public catalog. displayOrder is a
    // tiebreaker for future "pin to top" UX, not the main ordering signal.
    const rows = await prisma.song.findMany({
      where: { deletedAt: null },
      orderBy: [{ title: "asc" }, { displayOrder: "asc" }],
      select: {
        title: true,
        artist: true,
        genres: true,
        audioId: true,
        audioUrl: true,
        createdAt: true,
      },
    });

    if (rows.length === 0) {
      return defaultSongs.map(fromDefault);
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RECENTLY_ADDED_WINDOW_DAYS);

    return rows.map((row) => ({
      title: row.title,
      artist: row.artist,
      genres: row.genres.filter(isSongGenre) as SongGenre[],
      recentlyAdded: row.createdAt > cutoff,
      audioId: row.audioId,
      audioUrl: row.audioUrl,
    }));
  } catch (err) {
    console.error("[songs.load] falling back to defaults:", err);
    return defaultSongs.map(fromDefault);
  }
}
