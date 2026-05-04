"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { defaultFeaturedTeaserTiles } from "@/lib/media/default-placements";

// ═══════════════════════════════════════════════════════
// Gallery teaser — 8 curated tiles from /gallery.
// Single masonry strip, hover caption reveal, text-link CTA.
// Mirrors the /gallery treatment so the jump feels seamless.
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
// is a tall accent, the rest are uniform.
//
// The total area MUST equal 12 cells (4+2+1×6) so the grid tiles exactly
// in 4-col (3 rows), 3-col (4 rows), and 2-col (6 rows) layouts. Any other
// total leaves empty trailing cells that show through as black gaps against
// the dark section background.
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

const fallbackTiles: readonly TeaserTile[] = defaultFeaturedTeaserTiles.map(
  (tile, index) => ({
    src: tile.src,
    alt: tile.alt,
    title: tile.title,
    size: rhythmSize(index),
  }),
);

export const defaultTeaserTiles = fallbackTiles;

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
  // Always render exactly 8 tiles so the calibrated 12-cell rhythm tiles
  // cleanly in every breakpoint. Allan's uploads fill the front; curated
  // defaults pad the rest if he has fewer than 8. Sizes are reassigned by
  // position so the hero block is always the first uploaded photo.
  const adminTiles = tiles ?? [];
  const renderedTiles: readonly TeaserTile[] = [
    ...adminTiles,
    ...fallbackTiles,
  ]
    .slice(0, 8)
    .map((tile, index) => ({ ...tile, size: rhythmSize(index) }));
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10 bg-background">
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

                {/* Hover caption gradient + title */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-cinematic"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-cinematic motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <div className="h-px w-8 bg-champagne/80 mb-2" />
                  <p className="font-display italic text-sm md:text-base text-cream leading-tight drop-shadow">
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
