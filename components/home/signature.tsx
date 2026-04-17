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
// The Signature Moment — ONE featured audio card, cinematic,
// full-bleed within its section. Uses the shared audio store so
// background music ducks properly when the clip plays.
// ═══════════════════════════════════════════════════════

const SIGNATURE = {
  id: "somewhere-over-the-rainbow",
  title: "Over the Rainbow",
  composer: "Harold Arlen",
  genre: "Classic · Wedding",
  image: "/images/songs/somewhere-over-the-rainbow.jpg",
  audioUrl:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Somewhere%20Over%20the%20Rainbow%20Mix%202-LkxgMx5yX3tj6LBGYGddBsd5DjS1Kw.mp3",
};

export function HomeSignature() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  const [isLoading, setIsLoading] = useState(false);
  const { muteForOtherAudio, unmuteAfterOtherAudio } = useBackgroundMusic();
  const { currentlyPlaying, isPlaying, playAudio, pauseAudio } =
    useAudioStore();

  const isActive = currentlyPlaying === SIGNATURE.id && isPlaying;

  const toggle = async () => {
    if (isActive) {
      pauseAudio();
      unmuteAfterOtherAudio();
      return;
    }
    setIsLoading(true);
    muteForOtherAudio();
    try {
      await playAudio(SIGNATURE.id, SIGNATURE.audioUrl);
    } catch (err) {
      console.error("Signature playback failed", err);
    } finally {
      setIsLoading(false);
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
            <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
              The Signature Piece
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
            className="mt-6 font-display italic text-sm md:text-base text-muted-foreground/70 leading-relaxed"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.2 }
            }
          >
            One piece from the programme — the rest live in the repertoire.
          </motion.p>
        </header>

        {/* Cinematic signature card */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1, ease: EASE_OUT, delay: 0.2 }
          }
        >
          <div className="relative aspect-[21/9] md:aspect-[5/2] rounded-sm overflow-hidden ring-1 ring-champagne/20 group">
            {/* Background image */}
            <Image
              src={SIGNATURE.image}
              alt={`${SIGNATURE.title} — cover`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={false}
              className="object-cover object-center transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.02]"
            />

            {/* Cinematic gradient stack */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/55"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"
            />

            {/* Content grid — left: text, right: play button */}
            <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-16">
              <div className="flex items-center gap-6 md:gap-12 w-full">
                {/* Left: text */}
                <div className="flex-1 min-w-0">
                  <p className="label-caps !text-[10px] !tracking-[0.3em] !text-champagne/90 mb-3 md:mb-4">
                    {SIGNATURE.genre}
                  </p>

                  <h3 className="font-display font-light text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-cream drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
                    {SIGNATURE.title}
                  </h3>

                  <p className="mt-3 md:mt-4 font-display italic text-sm md:text-lg text-cream/75 drop-shadow">
                    {SIGNATURE.composer}
                  </p>

                  {/* Hairline */}
                  <div className="h-px w-10 bg-champagne/60 mt-6 md:mt-8 mb-5" />

                  {/* Quote */}
                  <p className="font-display italic text-xs md:text-base text-cream/70 max-w-md leading-relaxed drop-shadow hidden sm:block">
                    &ldquo;A song everyone knows, played the way no one
                    expects.&rdquo;
                  </p>
                </div>

                {/* Right: thin-stroke play button — signature of the site */}
                <button
                  type="button"
                  onClick={toggle}
                  disabled={isLoading}
                  aria-label={
                    isActive
                      ? `Pause ${SIGNATURE.title}`
                      : `Play ${SIGNATURE.title}`
                  }
                  aria-pressed={isActive}
                  className="shrink-0 group/play relative flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full border border-cream/70 hover:border-champagne bg-black/25 backdrop-blur-[2px] transition-all duration-500 ease-cinematic hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:hover:scale-100 motion-reduce:transition-none"
                >
                  {/* Soft halo on active */}
                  {isActive && !reduced && (
                    <span
                      className="absolute inset-0 rounded-full bg-champagne/20 animate-ping"
                      style={{ animationDuration: "2.4s" }}
                      aria-hidden="true"
                    />
                  )}

                  {isLoading ? (
                    <span
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-cream/30 border-t-champagne animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  ) : isActive ? (
                    <Pause
                      className="w-6 h-6 md:w-8 md:h-8 text-cream group-hover/play:text-champagne transition-colors duration-500 ease-cinematic"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  ) : (
                    <Play
                      className="w-6 h-6 md:w-8 md:h-8 text-cream group-hover/play:text-champagne transition-colors duration-500 ease-cinematic ml-1"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer — text link to full repertoire */}
          <div className="mt-8 md:mt-10 text-center">
            <Link
              href="/repertoire"
              className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
            >
              Browse the full repertoire
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
