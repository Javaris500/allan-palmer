"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  defaultGalleryPhotos,
  type CarouselPhoto,
} from "@/lib/media/default-gallery-photos";

// Re-exports for callers that import these from the carousel module.
export { defaultGalleryPhotos };
export type { CarouselPhoto };

function getTileClass(index: number, total: number): string {
  // Hero feature tile
  if (index === 0) return "col-span-2 row-span-2";
  // Don't apply spans to the trailing tail — a tall/wide tile near the
  // end leaves cells that nothing later can backfill, even with
  // grid-auto-flow:dense. Keeping the last 4 tiles as plain 1×1 lets the
  // grid finish flush with no white gaps.
  if (index >= total - 4) return "";
  // Wide landscape tiles — cadence every 9
  if (index > 0 && index % 9 === 0) return "col-span-2";
  // Tall portrait tiles — cadence every 7
  if (index > 0 && index % 7 === 0) return "row-span-2";
  return "";
}

export function PhotoGalleryCarousel({
  photos = defaultGalleryPhotos,
}: {
  photos?: CarouselPhoto[];
} = {}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  // Empty DB → render nothing instead of an awkward zero-image grid.
  if (photos.length === 0) {
    return (
      <p className="text-center font-display italic text-sm md:text-base text-muted-foreground py-8">
        New stills coming soon.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Masonry grid */}
      <div
        className="grid grid-flow-row-dense grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-[180px] md:auto-rows-[220px] lg:auto-rows-[240px]"
        role="list"
      >
        {photos.map((photo, index) => {
          const tileClass = getTileClass(index, photos.length);
          const isHero = index === 0;

          return (
            <motion.button
              key={photo.id}
              role="listitem"
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open ${photo.title}`}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      ease: EASE_OUT,
                      delay: Math.min(index * 0.02, 0.3),
                    }
              }
              className={cn(
                "group relative overflow-hidden rounded-sm ring-1 ring-champagne/10 hover:ring-champagne/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-[box-shadow,transform] duration-500 ease-cinematic",
                tileClass,
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  isHero
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                }
                className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                priority={index < 3}
              />

              {/* Gradient + caption — always visible. Hover-only captions
                  were unreadable on mobile and on bright photos. */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90"
                aria-hidden="true"
              />

              <div
                className="absolute inset-x-0 bottom-0 p-4 md:p-5 transition-transform duration-500 ease-cinematic group-hover:-translate-y-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              >
                <div className="h-px w-8 bg-champagne/80 mb-2" />
                <p className="font-display italic text-sm md:text-base text-cream leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  {photo.title}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Editorial footer */}
      <p className="mt-10 md:mt-12 text-center font-display italic text-xs md:text-sm text-muted-foreground tracking-wide">
        A selection of {photos.length} images
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
