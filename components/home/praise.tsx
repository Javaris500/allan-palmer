"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

// ═══════════════════════════════════════════════════════
// Praise — a single enormous pull quote, rotating slowly
// between a handful of real client reviews. No 5-card
// carousel, no star widgets, no Quote icon.
// ═══════════════════════════════════════════════════════

const praise = [
  {
    quote:
      "Allan played the cocktail and dinner hours at my wedding and it was absolutely wonderful. His extensive repertoire and grace under pressure made the day unforgettable.",
    author: "Renate Rossol",
    event: "Wedding Reception · June 2025",
    image: "/images/allan-1.jpeg",
  },
  {
    quote:
      "His playing was not only technically flawless but also deeply expressive — adding an elegant and heartfelt touch to our special day.",
    author: "Dale Stanley",
    event: "Wedding Ceremony",
    image: "/images/allan3.jpeg",
  },
  {
    quote:
      "He learned our favourite song and played it with perfection. Timely, warm, and entirely present — he saved our wedding during a false fire alarm.",
    author: "Jeremy De Las Alas",
    event: "Wedding Ceremony",
    image: "/images/allan-indoor-event.jpeg",
  },
  {
    quote:
      "Allan was the most incredible addition to our wedding. Professional, talented, and with a range that fit every moment perfectly.",
    author: "Claire Robinson",
    event: "Wedding Ceremony",
    image: "/images/allan2.jpeg",
  },
];

export function HomePraise() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % praise.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + praise.length) % praise.length);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [paused, next, reduced]);

  const current = praise[index]!;

  return (
    <section
      className="relative py-24 md:py-32 border-t border-champagne/10 bg-background overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient gradient behind the quote */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,hsl(var(--gold)/0.04)_0%,transparent_70%)]"
      />

      <div className="container relative px-6">
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
            <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
              In Praise
            </span>
            <div className="h-px w-10 md:w-16 bg-champagne/50" />
          </motion.div>
        </header>

        {/* The quote */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.author}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={
                reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }
              }
              className="text-center"
            >
              {/* Oversized opening quote mark as display character */}
              <span
                aria-hidden="true"
                className="block font-display text-[5rem] md:text-[7rem] leading-[0.5] text-champagne/25 select-none"
              >
                &ldquo;
              </span>

              <p className="font-display italic font-light text-xl md:text-3xl lg:text-[2.25rem] text-foreground/90 leading-[1.35] tracking-tight mt-4 md:mt-6">
                {current.quote}
              </p>

              {/* Attribution block */}
              <div className="flex items-center justify-center gap-4 mt-12 md:mt-14">
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-1 ring-champagne/30 shrink-0">
                  <Image
                    src={current.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="text-left">
                  <p className="font-display text-sm md:text-base text-foreground tracking-tight leading-tight">
                    {current.author}
                  </p>
                  <p className="label-caps !text-[10px] !tracking-[0.25em] !text-muted-foreground/70 mt-1">
                    {current.event}
                  </p>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>

          {/* Progress indicators + nav */}
          <div className="flex items-center justify-center gap-6 md:gap-8 mt-14 md:mt-16">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="group w-9 h-9 flex items-center justify-center rounded-full border border-champagne/30 text-champagne/70 hover:text-champagne hover:border-champagne/60 transition-colors duration-500 ease-cinematic"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>

            {/* Indicator dots */}
            <div className="flex items-center gap-2">
              {praise.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial ${i + 1} of ${praise.length}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`h-px transition-all duration-500 ease-cinematic ${
                    i === index ? "w-8 bg-champagne" : "w-3 bg-foreground/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="group w-9 h-9 flex items-center justify-center rounded-full border border-champagne/30 text-champagne/70 hover:text-champagne hover:border-champagne/60 transition-colors duration-500 ease-cinematic"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Link to full reviews (Google) */}
          <div className="text-center mt-10">
            <Link
              href="https://g.page/r/allan-palmer-violinist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
              aria-label="Read all reviews on Google (opens in new tab)"
            >
              Read all reviews on Google →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
