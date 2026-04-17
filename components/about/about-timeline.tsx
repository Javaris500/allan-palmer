"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

const timelineEvents = [
  {
    year: "2006",
    age: "Age 7",
    title: "First Violin",
    description:
      "A first instrument, a first teacher, and the beginning of a lifelong study of the violin.",
  },
  {
    year: "2008",
    age: "Age 9",
    title: "First Public Performance",
    description:
      "A first stage, a first audience, and the discovery that music is meant to be shared.",
  },
  {
    year: "2011",
    age: "Age 12",
    title: "Classical Training Deepens",
    description:
      "Years of intensive study — scales, études, and the slow accumulation of technique that makes expression possible.",
  },
  {
    year: "2015",
    age: "Age 16",
    title: "Teaching Begins",
    description:
      "Passing the craft forward — the first of many students taken on with patience, rigour, and genuine care.",
  },
  {
    year: "2017",
    age: "Age 18",
    title: "Into the Wedding Circuit",
    description:
      "From school halls to sanctuaries and reception rooms — music for the occasions that matter most.",
  },
  {
    year: "2021",
    age: "Age 22",
    title: "A Recognised Voice",
    description:
      "Now among Winnipeg's most sought-after violinists for weddings, ceremonies, and private events.",
  },
];

export function AboutTimeline() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10">
      <div className="container">
        {/* Section header */}
        <header className="text-center mb-20 md:mb-24 max-w-2xl mx-auto">
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
              The Journey
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
            A Musical Life
          </motion.h2>

          <motion.p
            className="mt-8 font-display italic text-base md:text-lg text-muted-foreground/75 leading-relaxed"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.25 }
            }
          >
            A journey measured not in years, but in performances, students, and
            shared moments.
          </motion.p>

          <div className="divider-gold-sm mt-10" />
        </header>

        {/* Single-column programme of events */}
        <ol className="max-w-2xl mx-auto space-y-20 md:space-y-24">
          {timelineEvents.map((event, idx) => (
            <motion.li
              key={event.year}
              className="relative"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOnce}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.9,
                      ease: EASE_OUT,
                      delay: Math.min(idx * 0.05, 0.25),
                    }
              }
            >
              {/* Ghost year numeral — like bar numbers on a score */}
              <div
                aria-hidden="true"
                className="font-display text-[5.5rem] md:text-[8rem] leading-[0.85] font-light text-champagne/[0.08] select-none pointer-events-none tracking-tight -ml-1"
              >
                {event.year}
              </div>

              {/* Entry content — overlaps the ghost numeral */}
              <div className="relative -mt-10 md:-mt-14 pl-1">
                <div className="label-caps !text-[10px] md:!text-[11px] !tracking-[0.3em] mb-3">
                  {event.year} · {event.age}
                </div>
                <h3 className="font-display font-light text-2xl md:text-3xl text-foreground/95 mb-3 tracking-tight leading-snug">
                  {event.title}
                </h3>
                <p className="font-display italic text-sm md:text-base text-muted-foreground/75 leading-relaxed max-w-lg">
                  {event.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Quiet closing cue */}
        <div className="mt-24 md:mt-32 text-center">
          <div className="divider-gold-sm mb-6" />
          <p className="font-display italic text-sm md:text-base text-muted-foreground/50">
            The journey continues.
          </p>
        </div>
      </div>
    </section>
  );
}
