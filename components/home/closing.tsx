"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

// ═══════════════════════════════════════════════════════
// Closing invocation — full-width pull quote,
// f-hole watermark, gold CTA + text link.
// Mirrors every other page's closing ritual.
// ═══════════════════════════════════════════════════════

export function HomeClosing() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-28 md:py-40 border-t border-champagne/10 bg-background overflow-hidden">
      {/* Ambient warmth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,hsl(var(--gold)/0.05)_0%,transparent_70%)]"
      />

      {/* F-hole signature motif — mirrors the hero, closes the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 bottom-0 opacity-[0.045] hidden md:block select-none rotate-180"
      >
        <Image src="/images/f-hole.svg" alt="" width={220} height={640} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-0 opacity-[0.045] hidden md:block select-none"
      >
        <Image src="/images/f-hole.svg" alt="" width={220} height={640} />
      </div>

      <div className="container relative max-w-3xl mx-auto text-center px-6">
        {/* Top hairline */}
        <motion.div
          className="divider-gold-sm mb-10 md:mb-12"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={viewOnce}
          transition={
            reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }
          }
        />

        {/* Pull quote */}
        <motion.blockquote
          className="font-display italic font-light text-2xl md:text-4xl lg:text-[2.75rem] text-foreground/90 leading-[1.3] tracking-tight mb-12 md:mb-14"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1, ease: EASE_OUT, delay: 0.1 }
          }
        >
          &ldquo;Music for occasions that deserve to be remembered.&rdquo;
        </motion.blockquote>

        {/* CTA row — unified with all other pages */}
        <motion.div
          className="flex items-center justify-center gap-8"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.3 }
          }
        >
          <Link
            href="/booking"
            className="inline-block bg-gold hover:bg-champagne text-ink px-9 py-4 rounded-sm text-[11px] md:text-xs tracking-[0.24em] uppercase font-label transition-colors duration-500 ease-cinematic"
          >
            Book Allan
          </Link>
          <Link
            href="/about"
            className="text-link !text-[11px] md:!text-xs !tracking-[0.24em] text-muted-foreground hover:text-champagne"
          >
            About the Artist
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
