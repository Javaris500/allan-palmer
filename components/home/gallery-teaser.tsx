"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════
// Gallery teaser — up to 8 curated tiles, sourced entirely from the
// admin-managed Photo table. Single masonry strip, hover caption
// reveal, text-link CTA. Mirrors the /gallery treatment so the jump
// feels seamless.
// ═══════════════════════════════════════════════════════

export type TeaserTileSize = "hero" | "wide" | "tall" | "default";

export type TeaserTile = {
  src: string;
  alt: string;
  title: string;
  size: TeaserTileSize;
};

// Allan's uploads come in flat, without a `size` hint. We project them onto
// this masonry rhythm — the first image becomes the hero block, the second
// is a tall accent, the rest are uniform. With 8 tiles the grid tiles cleanly
// in 4-col, 3-col, and 2-col layouts; with fewer tiles the section shrinks.
const MASONRY_RHYTHM: TeaserTileSize[] = [
  "hero",
  "tall",
  "default",
  "default",
  "default",
  "default",
  "default",
  "default",
];

export function rhythmSize(index: number): TeaserTileSize {
  return MASONRY_RHYTHM[index % MASONRY_RHYTHM.length] ?? "default";
}

function getTileClass(size: TeaserTileSize): string {
  switch (size) {
    case "hero":
      return "col-span-2 row-span-2";
    case "wide":
      return "col-span-2";
    case "tall":
      return "row-span-2";
    default:
      return "";
  }
}

export function HomeGalleryTeaser({ tiles }: { tiles?: TeaserTile[] } = {}) {
  // No DB photos = no section. We deliberately do NOT pad with hard-coded
  // /images/gallery/* fallbacks anymore — those couldn't be deleted from
  // admin, so Allan would delete every photo from the admin and still see
  // 8 photos on the homepage. The whole Selected Stills section now hides
  // until there are real DB rows to show.
  const adminTiles = tiles ?? [];
  if (adminTiles.length === 0) return null;
  const renderedTiles: readonly TeaserTile[] = adminTiles
    .slice(0, 8)
    .map((tile, index) => ({ ...tile, size: rhythmSize(index) }));
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section
      id="selected-stills"
      className="relative py-24 md:py-32 border-t border-champagne/10 bg-background scroll-mt-24"
    >
      <div className="container px-6">
        {/* Section header */}
        <header className="text-center mb-12 md:mb-16 max-w-xl mx-auto">
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
              In Frame
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
            Selected Stills
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
            A glimpse from the portfolio — weddings, ceremonies, and the quiet
            moments between.
          </motion.p>
        </header>

        {/* Masonry grid — 3 cols lg, 2 cols sm.
            grid-flow-dense backfills the holes that variable-sized tiles
            (hero/wide/tall) leave on narrow viewports — without it the
            mobile layout shows a black gap where small tiles would have
            slotted in. */}
        <div
          className="grid grid-flow-dense grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-[180px] md:auto-rows-[200px] lg:auto-rows-[220px] max-w-6xl mx-auto"
          role="list"
        >
          {renderedTiles.map((tile, index) => (
            <motion.div
              key={`${tile.src}-${index}`}
              role="listitem"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      ease: EASE_OUT,
                      delay: Math.min(index * 0.04, 0.3),
                    }
              }
              className={cn(
                "group relative overflow-hidden rounded-sm ring-1 ring-champagne/10 hover:ring-champagne/40 transition-[box-shadow] duration-500 ease-cinematic",
                getTileClass(tile.size),
              )}
            >
              <Link
                href="/gallery"
                aria-label={`${tile.title} — view gallery`}
                className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />

                {/* Caption gradient + title — always visible. The previous
                    hover-only reveal was invisible on mobile (no hover) and
                    unreadable against light photos even on desktop. */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 ease-cinematic group-hover:from-black/90"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-4 md:p-5 transition-transform duration-500 ease-cinematic group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <div className="h-px w-8 bg-champagne/80 mb-2" />
                  <p className="font-display italic text-sm md:text-base text-cream leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                    {tile.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA text link */}
        <div className="text-center mt-12 md:mt-14">
          <Link
            href="/gallery"
            className="text-link !text-sm !tracking-[0.18em] text-champagne hover:text-cream inline-flex items-center gap-2"
          >
            <span className="label-caps !text-sm">
              View the Full Portfolio
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-cinematic"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
