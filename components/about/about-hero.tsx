"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

const stats = [
  { value: "18+", label: "Years with violin" },
  { value: "200+", label: "Engagements" },
  { value: "148", label: "Selected works" },
];

export function AboutHero() {
  const reduced = useReducedMotion();
  const fade = (delay = 0) => ({
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: reduced
      ? { duration: 0 }
      : { duration: 0.9, ease: EASE_OUT, delay },
  });

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Whisper-soft warmth — no gradient mesh */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,hsl(var(--gold)/0.06)_0%,transparent_70%)]" />
      </div>

      {/* F-hole brand watermark — bottom-right, barely there */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 bottom-0 opacity-[0.035] select-none hidden md:block"
      >
        <Image
          src="/images/f-hole.svg"
          alt=""
          width={220}
          height={640}
          className="text-champagne"
        />
      </div>

      <div className="container relative">
        {/* Eyebrow — programme-style label */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12 md:mb-16"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }
          }
        >
          <div className="h-px w-10 md:w-16 bg-champagne/50" />
          <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
            The Violinist
          </span>
          <div className="h-px w-10 md:w-16 bg-champagne/50" />
        </motion.div>

        <div className="grid lg:grid-cols-[5fr_6fr] gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Portrait — spotlight hits first */}
          <motion.div
            className="relative aspect-[3/4] ring-1 ring-champagne/20 overflow-hidden rounded-sm"
            {...fade(0.1)}
          >
            <Image
              src="/images/allan-portrait-bw.jpeg"
              alt="Allan Palmer, professional violinist"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
          </motion.div>

          {/* Content — programme notes follow */}
          <motion.div className="space-y-9" {...fade(0.3)}>
            {/* Two-line editorial h1 */}
            <div>
              <h1 className="font-display font-light text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02]">
                Allan Palmer
              </h1>
              <p className="mt-3 md:mt-4 font-label text-xs md:text-sm tracking-[0.4em] uppercase text-champagne">
                — Violinist —
              </p>
            </div>

            {/* Opening paragraph */}
            <div className="space-y-5 font-display text-base md:text-lg text-foreground/75 leading-relaxed">
              <p>
                From a first violin at age seven to a career shaped by weddings,
                ceremonies, and concert halls across Winnipeg and beyond, Allan
                brings both technical mastery and emotional depth to every
                performance.
              </p>
            </div>

            {/* Mid-column pull quote — breaks prose monotony, establishes credibility */}
            <blockquote className="relative border-l border-champagne/40 pl-5 md:pl-6 py-1">
              <p className="font-display italic font-light text-lg md:text-xl text-foreground/90 leading-[1.45]">
                &ldquo;An absolute pleasure — our guests couldn&rsquo;t stop
                talking about the music.&rdquo;
              </p>
              <cite className="mt-3 block label-caps !text-[10px] !tracking-[0.25em] not-italic text-muted-foreground">
                Rebecca T. · Wedding Client
              </cite>
            </blockquote>

            {/* Closing paragraph */}
            <div className="font-display text-base md:text-lg text-foreground/75 leading-relaxed">
              <p>
                Whether the moment calls for Bach or The Beatles, the intent is
                the same — to honour the occasion with music that lasts long
                after the final note.
              </p>
            </div>

            {/* Typographic stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-champagne/20">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-light text-3xl md:text-4xl text-champagne leading-none tabular-nums">
                    {s.value}
                  </div>
                  <div className="label-caps !text-[10px] md:!text-[11px] mt-2.5 leading-tight !text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Single solid CTA + underline text link (unified pattern) */}
            <div className="flex items-center gap-8 pt-4">
              <Link
                href="/booking"
                className="inline-block bg-gold hover:bg-champagne text-ink px-8 py-3.5 rounded-sm text-[11px] md:text-xs tracking-[0.22em] uppercase font-label transition-colors duration-500 ease-cinematic"
              >
                Book Allan
              </Link>
              <Link
                href="/services"
                className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
