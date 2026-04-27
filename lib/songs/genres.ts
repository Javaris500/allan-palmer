// Canonical genre keys used across the song catalog and admin UI.
// Stored as lowercase strings in the DB (Song.genres String[]).

export const SONG_GENRE_KEYS = [
  "classical",
  "wedding",
  "jazz",
  "latin",
  "italian",
  "film",
  "sacred",
  "pop",
] as const;

export type SongGenre = (typeof SONG_GENRE_KEYS)[number];

export const SONG_GENRE_LABELS: Record<SongGenre, string> = {
  classical: "Classical",
  wedding: "Wedding",
  jazz: "Jazz",
  latin: "Latin",
  italian: "Italian",
  film: "Film & Show",
  sacred: "Sacred",
  pop: "Pop & Rock",
};

export function isSongGenre(value: string): value is SongGenre {
  return (SONG_GENRE_KEYS as readonly string[]).includes(value);
}
