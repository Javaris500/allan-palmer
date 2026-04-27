"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useAudioStore } from "@/stores/audio-store";
import { useBackgroundMusic } from "@/contexts/background-music-context";
import { cn } from "@/lib/utils";
import {
  SONG_GENRE_KEYS,
  SONG_GENRE_LABELS,
  type SongGenre,
} from "@/lib/songs/genres";

type Genre = "all" | "recent" | SongGenre;

export interface CatalogSong {
  title: string;
  artist?: string | null;
  genres: SongGenre[];
  recentlyAdded?: boolean;
  audioId?: string | null;
  audioUrl?: string | null;
}

const GENRES: { id: Genre; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recent", label: "Recently Added" },
  ...SONG_GENRE_KEYS.map((g) => ({ id: g, label: SONG_GENRE_LABELS[g] })),
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface SongCatalogProps {
  songs: CatalogSong[];
}

export function SongCatalog({ songs }: SongCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<Genre>("all");

  const { muteForOtherAudio, unmuteAfterOtherAudio } = useBackgroundMusic();
  const { currentlyPlaying, isPlaying, playAudio, pauseAudio } =
    useAudioStore();

  const filteredSongs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return songs.filter((song) => {
      let matchesGenre: boolean;
      if (activeGenre === "all") {
        matchesGenre = true;
      } else if (activeGenre === "recent") {
        matchesGenre = song.recentlyAdded === true;
      } else {
        matchesGenre = song.genres.includes(activeGenre);
      }
      if (!matchesGenre) return false;
      if (!q) return true;
      return (
        song.title.toLowerCase().includes(q) ||
        (!!song.artist && song.artist.toLowerCase().includes(q))
      );
    });
  }, [songs, searchQuery, activeGenre]);

  const groupedSongs = useMemo(() => {
    const groups: Record<string, CatalogSong[]> = {};
    filteredSongs.forEach((song) => {
      const letter = (song.title[0] ?? "#").toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(song);
    });
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, songs: groups[letter]! }));
  }, [filteredSongs]);

  const availableLetters = useMemo(
    () => new Set(groupedSongs.map((g) => g.letter)),
    [groupedSongs],
  );

  const togglePlayPause = async (song: CatalogSong) => {
    if (!song.audioId || !song.audioUrl) return;
    if (currentlyPlaying === song.audioId && isPlaying) {
      pauseAudio();
      unmuteAfterOtherAudio();
      return;
    }
    muteForOtherAudio();
    try {
      await playAudio(song.audioId, song.audioUrl);
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasFilter = searchQuery.trim().length > 0 || activeGenre !== "all";

  return (
    <div className="relative">
      {/* A-Z Rail — desktop only */}
      <nav
        aria-label="Jump to letter"
        className="hidden lg:flex fixed right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-[3px]"
      >
        {ALPHABET.map((letter) => {
          const active = availableLetters.has(letter);
          return (
            <button
              key={letter}
              type="button"
              onClick={() => active && scrollToLetter(letter)}
              disabled={!active}
              aria-label={`Jump to ${letter}`}
              className={cn(
                "w-5 h-5 flex items-center justify-center text-[10px] tracking-widest font-serif transition-colors duration-200",
                active
                  ? "text-muted-foreground/60 hover:text-gold cursor-pointer"
                  : "text-foreground/10 cursor-default",
              )}
            >
              {letter}
            </button>
          );
        })}
      </nav>

      {/* Sticky filter + search */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md pt-6 pb-4 -mx-4 px-4 border-b border-border/30">
        {/* Genre filter */}
        <div
          role="tablist"
          aria-label="Filter by genre"
          className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
        >
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              role="tab"
              aria-selected={activeGenre === genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className={cn(
                "shrink-0 text-[11px] tracking-[0.18em] uppercase px-3 py-2 font-medium transition-all duration-300 border-b-[1.5px] whitespace-nowrap",
                activeGenre === genre.id
                  ? "text-gold border-gold"
                  : "text-muted-foreground/60 border-transparent hover:text-foreground hover:border-border",
              )}
            >
              {genre.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <input
            type="search"
            placeholder="Search the programme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search songs or artists"
            className="w-full bg-transparent border-0 border-b border-border/40 focus:border-gold rounded-none px-0 py-2.5 text-sm font-serif italic placeholder:text-muted-foreground/40 focus:outline-none focus:ring-0 transition-colors duration-300"
          />
        </div>

        {/* Conditional count */}
        {hasFilter && (
          <p className="mt-2 text-[11px] font-serif italic text-muted-foreground/60">
            {filteredSongs.length === 0
              ? "No pieces match your selection."
              : `${filteredSongs.length} ${filteredSongs.length === 1 ? "piece" : "pieces"} match your selection.`}
          </p>
        )}
      </div>

      {/* Programme list */}
      {groupedSongs.length > 0 ? (
        <div className="relative pt-10">
          {groupedSongs.map(({ letter, songs }, idx) => (
            <motion.section
              key={letter}
              id={`letter-${letter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: Math.min(idx * 0.03, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative scroll-mt-[180px] md:scroll-mt-[160px] mb-16 md:mb-20"
            >
              {/* Ghost letterform */}
              <div
                aria-hidden="true"
                className="font-serif text-[7rem] md:text-[10rem] leading-[0.85] font-light text-gold/[0.09] select-none pointer-events-none -ml-1 md:-ml-2"
              >
                {letter}
              </div>

              {/* Programme rows */}
              <ul className="relative -mt-6 md:-mt-10 divide-y divide-border/25">
                {songs.map((song) => {
                  const isCurrentAndPlaying =
                    song.audioId != null &&
                    currentlyPlaying === song.audioId &&
                    isPlaying;
                  return (
                    <li
                      key={`${song.title}|${song.artist ?? ""}`}
                      className="group flex items-baseline gap-4 py-3 md:py-3.5 transition-colors duration-300"
                    >
                      {/* Play button slot — gold triangle where audio exists, otherwise empty */}
                      <div className="shrink-0 w-4 flex items-center justify-center">
                        {song.audioUrl ? (
                          <button
                            type="button"
                            onClick={() => togglePlayPause(song)}
                            aria-label={
                              isCurrentAndPlaying
                                ? `Pause ${song.title}`
                                : `Play a sample of ${song.title}`
                            }
                            className={cn(
                              "text-gold transition-opacity duration-300",
                              isCurrentAndPlaying
                                ? "opacity-100"
                                : "opacity-50 group-hover:opacity-100 hover:opacity-100",
                            )}
                          >
                            {isCurrentAndPlaying ? (
                              <Pause className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <Play className="h-3 w-3" aria-hidden="true" />
                            )}
                          </button>
                        ) : null}
                      </div>

                      {/* Title */}
                      <span
                        className={cn(
                          "font-serif text-[15px] md:text-base leading-snug min-w-0 flex-1 transition-colors duration-300 inline-flex items-baseline gap-2 flex-wrap",
                          isCurrentAndPlaying
                            ? "text-gold"
                            : "text-foreground/90 group-hover:text-gold",
                        )}
                      >
                        <span className="min-w-0">{song.title}</span>
                        {song.recentlyAdded && (
                          <span
                            className="shrink-0 text-[9px] tracking-[0.18em] uppercase font-medium text-gold/90 border border-gold/40 bg-gold/5 px-1.5 py-[1px] rounded-sm"
                            aria-label="Recently added"
                          >
                            New
                          </span>
                        )}
                      </span>

                      {/* Composer/artist */}
                      {song.artist && (
                        <span className="font-serif italic text-xs md:text-sm text-muted-foreground/60 text-right shrink-0 max-w-[40%] md:max-w-[50%] truncate">
                          {song.artist}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif italic text-xl text-muted-foreground/50 mb-3">
            No pieces match your selection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveGenre("all");
            }}
            className="text-[11px] tracking-[0.2em] uppercase text-gold hover:text-gold/80 transition-colors border-b border-gold/40 hover:border-gold pb-0.5"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
