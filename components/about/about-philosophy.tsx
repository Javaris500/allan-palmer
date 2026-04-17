"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { VideoPlayer } from "@/components/video-player";
import { EASE_OUT } from "@/lib/motion";

const philosophyPoints = [
  {
    title: "Passion First",
    description:
      "Passion is the foundation of musical excellence. When you love what you play, it reaches the listener before any note does.",
  },
  {
    title: "Technical Excellence",
    description:
      "Mastery of technique is what makes true expression possible — the quiet discipline that lets a performance breathe.",
  },
  {
    title: "Creative Expression",
    description:
      "Music is a language of emotion. The work is helping each player — student or performer — find their voice within it.",
  },
  {
    title: "Community Connection",
    description:
      "Music brings people together. Whether performing or teaching, the craft is always in service of the shared moment.",
  },
];

export function AboutPhilosophy() {
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
              The Craft
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
            On Teaching
          </motion.h2>
        </header>

        {/* Pull quote */}
        <motion.blockquote
          className="max-w-3xl mx-auto text-center mb-20 md:mb-24 px-4"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1, ease: EASE_OUT, delay: 0.15 }
          }
        >
          <p className="font-display italic font-light text-2xl md:text-3xl lg:text-[2.25rem] text-foreground/85 leading-[1.35] tracking-tight">
            &ldquo;Music is a language of emotion. My work is finding the right
            words for each moment.&rdquo;
          </p>
          <cite className="block mt-8 label-caps !text-[10px] !tracking-[0.3em] not-italic">
            — Allan Palmer
          </cite>
        </motion.blockquote>

        {/* Philosophy points — numbered programme list */}
        <ol className="max-w-xl mx-auto space-y-10 md:space-y-12 mb-24 md:mb-28">
          {philosophyPoints.map((point, idx) => (
            <motion.li
              key={point.title}
              className="flex gap-5 md:gap-6"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.8,
                      ease: EASE_OUT,
                      delay: Math.min(idx * 0.08, 0.3),
                    }
              }
            >
              <span className="shrink-0 w-8 pt-1 font-display text-[11px] tabular-nums tracking-widest text-champagne/70">
                0{idx + 1}
              </span>
              <div className="flex-1 border-l border-champagne/25 pl-5 md:pl-6">
                <h3 className="font-display text-lg md:text-xl text-foreground/90 mb-2 tracking-tight">
                  {point.title}
                </h3>
                <p className="font-display italic text-sm md:text-base text-muted-foreground/70 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Duotone diptych — teaching photo + video */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          <motion.div
            className="relative aspect-[4/3] ring-1 ring-champagne/15 rounded-sm overflow-hidden group"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.1 }
            }
          >
            <Image
              src="/teaching-certificates.jpg"
              alt="Allan Palmer celebrating student achievements at Palms Music Studio"
              fill
              className="object-cover object-center grayscale brightness-95 contrast-105 transition-all duration-700 ease-cinematic group-hover:grayscale-0 motion-reduce:transition-none"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
              <span className="label-caps !text-[9px] md:!text-[10px] !tracking-[0.3em] !text-cream/90 drop-shadow">
                Palms Music Studio
              </span>
              <span className="label-caps !text-[9px] md:!text-[10px] !tracking-[0.2em] drop-shadow">
                Teaching
              </span>
            </div>
          </motion.div>

          <motion.div
            className="relative aspect-[4/3] ring-1 ring-champagne/15 rounded-sm overflow-hidden"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.2 }
            }
          >
            <VideoPlayer
              playbackId="I025pVKflyFHaw00PTUJEhQQggnkunham1LrNwJOrnj8Q"
              title="Allan Palmer - Teaching Session"
              description="A lesson at Palms Music Studio"
              className="h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
