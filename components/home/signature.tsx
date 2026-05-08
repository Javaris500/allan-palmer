"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useAudioStore } from "@/stores/audio-store";
import { useBackgroundMusic } from "@/contexts/background-music-context";
import { EASE_OUT } from "@/lib/motion";

// ═══════════════════════════════════════════════════════
// On Record — four branded singles displayed as a tasteful 2×2
// of square covers. Each card is a play/pause button. Uses the
// shared audio store so background music ducks while a clip plays.
// ═══════════════════════════════════════════════════════

type Single = {
  id: string;
  title: string;
  composer: string;
  image: string;
  audioUrl: string;
};

const SINGLES: readonly Single[] = [
  {
    id: "you-are-the-reason",
    title: "You Are the Reason",
    composer: "Calum Scott",
    image: "/images/songs/you-are-the-reason.jpg",
    audioUrl: "/audio/you-are-the-reason.mp3",
  },
  {
    id: "hallelujah",
    title: "Hallelujah",
    composer: "Leonard Cohen",
    image: "/images/songs/hallelujah.jpg",
    audioUrl: "/audio/hallelujah.mp3",
  },
  {
    id: "what-a-wonderful-world",
    title: "What a Wonderful World",
    composer: "Louis Armstrong",
    image: "/images/songs/what-a-wonderful-world.jpg",
    audioUrl: "/audio/wonderful-world.mp3",
  },
  {
    id: "bella-ciao",
    title: "Bella Ciao",
    composer: "Italian Folk Song",
    image: "/images/songs/bella-ciao.jpg",
    audioUrl: "/audio/bella-ciao.mp3",
  },
];

export function HomeSignature() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { muteForOtherAudio, unmuteAfterOtherAudio } = useBackgroundMusic();
  const { currentlyPlaying, isPlaying, playAudio, pauseAudio } =
    useAudioStore();

  const toggle = async (single: Single) => {
    const isActive = currentlyPlaying === single.id && isPlaying;
    if (isActive) {
      pauseAudio();
      unmuteAfterOtherAudio();
      return;
    }
    setLoadingId(single.id);
    muteForOtherAudio();
    try {
      await playAudio(single.id, single.audioUrl);
    } catch (err) {
      console.error("Single playback failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10 bg-background overflow-hidden">
      <div className="container px-6">
        {/* Section header */}
        <header className="text-center mb-14 md:mb-16 max-w-xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }
            }
          >
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
            <span className="label-caps !text-xs md:!text-sm !tracking-[0.22em]">
              On Record
            </span>
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
          </motion.div>

          <motion.h2
            className="font-display font-light text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.1 }
            }
          >
            Listen for a Moment
          </motion.h2>

          <motion.p
            className="mt-6 font-display italic text-base md:text-lg text-muted-foreground leading-relaxed"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.2 }
            }
          >
            A handful of singles from the catalogue — the rest live in the
            repertoire.
          </motion.p>
        </header>

        {/* 2×2 singles grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {SINGLES.map((single, index) => {
            const isActive = currentlyPlaying === single.id && isPlaying;
            const isLoading = loadingId === single.id;

            return (
              <motion.figure
                key={single.id}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewOnce}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 0.9,
                        ease: EASE_OUT,
                        delay: 0.1 + index * 0.08,
                      }
                }
                className="group"
              >
                {/* Cover — entire square is the play/pause button */}
                <button
                  type="button"
                  onClick={() => toggle(single)}
                  disabled={isLoading}
                  aria-label={
                    isActive ? `Pause ${single.title}` : `Play ${single.title}`
                  }
                  aria-pressed={isActive}
                  className="relative block w-full aspect-square overflow-hidden rounded-sm ring-1 ring-champagne/15 hover:ring-champagne/40 transition-[box-shadow,transform] duration-500 ease-cinematic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Image
                    src={single.image}
                    alt={`${single.title} — cover art`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                    className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />

                  {/* Play badge — bottom-right, always visible. Pulses
                      gently while playing. */}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-cream/80 bg-black/45 backdrop-blur-[3px] shadow-lg transition-all duration-500 ease-cinematic group-hover:scale-105 group-hover:border-champagne motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  >
                    {isActive && !reduced && (
                      <span
                        className="absolute inset-0 rounded-full bg-champagne/25 animate-ping"
                        style={{ animationDuration: "2.4s" }}
                      />
                    )}
                    {isLoading ? (
                      <span className="w-4 h-4 rounded-full border-2 border-cream/30 border-t-champagne animate-spin motion-reduce:animate-none" />
                    ) : isActive ? (
                      <Pause
                        className="w-5 h-5 md:w-6 md:h-6 text-cream"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Play
                        className="w-5 h-5 md:w-6 md:h-6 text-cream ml-0.5"
                        strokeWidth={1.5}
                      />
                    )}
                  </span>
                </button>

                <figcaption className="mt-4 text-center">
                  <p className="font-display italic text-lg md:text-xl text-foreground leading-tight">
                    {single.title}
                  </p>
                  <p className="mt-1 label-caps !text-xs !tracking-[0.14em] md:!tracking-[0.18em] text-muted-foreground">
                    {single.composer}
                  </p>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>

        {/* Footer — text link to full repertoire */}
        <div className="mt-12 md:mt-14 text-center">
          <Link
            href="/repertoire"
            className="text-link !text-sm !tracking-[0.18em] text-muted-foreground hover:text-champagne"
          >
            Browse the full repertoire
          </Link>
        </div>
      </div>
    </section>
  );
}
