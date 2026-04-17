"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export function AboutMedia() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10">
      <div className="container">
        {/* Section header */}
        <header className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced ? { duration: 0 } : { duration: 0.8, ease: EASE_OUT }
            }
          >
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
            <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
              In Conversation
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
            Featured Interview
          </motion.h2>
        </header>

        {/* Video — archival-artefact frame with programme-style meta bar */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.2 }
          }
        >
          <div className="border border-champagne/20 rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-6 py-3 border-b border-champagne/15">
              <span className="label-caps !text-[10px] !tracking-[0.3em]">
                Podcast Interview
              </span>
              <span className="label-caps !text-[10px] !tracking-[0.2em] !text-muted-foreground/55">
                YouTube
              </span>
            </div>
            <div className="aspect-video bg-black relative">
              <iframe
                src="https://www.youtube.com/embed/OmtV745R3fw"
                title="Allan Palmer Podcast Interview"
                loading="lazy"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>

        {/* Editorial caption below */}
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.3 }
          }
        >
          <h3 className="font-display font-light text-2xl md:text-3xl text-foreground/90 mb-5 tracking-tight leading-snug">
            Music, Teaching, and the Long Walk Between Them
          </h3>
          <p className="font-display italic text-sm md:text-base text-muted-foreground/70 leading-relaxed mb-8 max-w-lg mx-auto">
            Allan discusses his musical journey, teaching philosophy, and the
            craft of performing for life&rsquo;s most significant occasions.
          </p>
          <a
            href="https://youtu.be/OmtV745R3fw?si=_59sexEQ5lv-I5Im"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link !text-[11px] !tracking-[0.25em] text-champagne hover:text-cream inline-flex items-center gap-2"
            aria-label="Watch the full interview on YouTube (opens in new tab)"
          >
            Watch on YouTube
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-cinematic group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
