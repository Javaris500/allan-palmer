"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

// ═══════════════════════════════════════════════════════
// Editorial anchor — the quiet breath after the hero.
// One-line manifesto + location credential. Nothing else.
// ═══════════════════════════════════════════════════════

export function HomeAnchor() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-background">
      <div className="container max-w-3xl mx-auto text-center px-6">
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewOnce}
          transition={
            reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }
          }
        >
          <div className="h-px w-10 md:w-16 bg-champagne/50" />
          <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.4em]">
            The Programme
          </span>
          <div className="h-px w-10 md:w-16 bg-champagne/50" />
        </motion.div>

        <motion.p
          className="font-display font-light italic text-2xl md:text-4xl lg:text-[2.75rem] text-foreground/90 leading-[1.25] tracking-tight"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1.1, ease: EASE_OUT, delay: 0.1 }
          }
        >
          &ldquo;Every occasion has a song — and the right violin knows how to
          find it.&rdquo;
        </motion.p>

        <motion.div
          className="divider-gold-sm mt-12 mb-6"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.3 }
          }
        />

        <motion.p
          className="label-caps !text-[10px] md:!text-[11px] !tracking-[0.35em] !text-muted-foreground/70"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.4 }
          }
        >
          Winnipeg, Manitoba · Performing since 2006
        </motion.p>
      </div>
    </section>
  );
}
