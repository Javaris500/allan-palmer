"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════
// Offerings triptych — compact home-page mirror of /services.
// Three editorial cards: Weddings · Private · Lessons.
// ═══════════════════════════════════════════════════════

interface Offering {
  number: string;
  label: string;
  title: string;
  tagline: string;
  features: string[];
  href: string;
  featured?: boolean;
}

const offerings: Offering[] = [
  {
    number: "01",
    label: "Weddings",
    title: "Ceremonies & Celebrations",
    tagline: "From aisle to last dance — music shaped to the day.",
    features: [
      "Ceremony & processional",
      "Cocktail hour",
      "Reception entertainment",
      "First-dance arrangements",
    ],
    href: "/services#weddings",
    featured: true,
  },
  {
    number: "02",
    label: "Private & Corporate",
    title: "Private Engagements",
    tagline: "Bespoke music for occasions that deserve to be remembered.",
    features: [
      "Dinner parties & anniversaries",
      "Galas & product launches",
      "Celebrations of life",
      "Custom arrangements",
    ],
    href: "/services#private",
  },
  {
    number: "03",
    label: "Lessons",
    title: "Violin Instruction",
    tagline: "Personalised lessons from beginner to advanced.",
    features: [
      "Beginner to advanced",
      "Classical & contemporary",
      "In-person & online",
      "Performance opportunities",
    ],
    href: "/lessons",
  },
];

function OfferingCard({ offering }: { offering: Offering }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className={cn(
        "group relative flex flex-col h-full p-8 md:p-10 rounded-sm border transition-colors duration-500 ease-cinematic",
        offering.featured
          ? "border-champagne/35 bg-champagne/[0.02] hover:border-champagne/55"
          : "border-champagne/15 hover:border-champagne/35",
      )}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }}
    >
      {/* Ghost numeral */}
      <div
        aria-hidden="true"
        className="font-display text-[5rem] md:text-[6rem] leading-[0.8] font-light text-champagne/[0.12] select-none pointer-events-none tracking-tight -mb-4 md:-mb-6"
      >
        {offering.number}
      </div>

      {/* Category label */}
      <p className="label-caps !text-[10px] !tracking-[0.3em] mb-4">
        {offering.label}
        {offering.featured && (
          <span className="ml-3 text-champagne/55 italic tracking-normal normal-case text-[10px] font-display">
            · Most Requested
          </span>
        )}
      </p>

      {/* Title */}
      <h3 className="font-display font-light text-2xl md:text-[1.75rem] tracking-tight leading-[1.15] text-foreground mb-4">
        {offering.title}
      </h3>

      {/* Tagline */}
      <p className="font-display italic text-sm md:text-[15px] text-muted-foreground/75 leading-relaxed mb-7">
        {offering.tagline}
      </p>

      {/* Hairline separator */}
      <div className="h-px w-8 bg-champagne/40 mb-5" />

      {/* Em-dash feature list */}
      <ul className="space-y-2 mb-8 flex-1">
        {offering.features.map((feature) => (
          <li
            key={feature}
            className="flex items-baseline gap-3 font-display text-sm md:text-[15px] text-foreground/80 leading-relaxed"
          >
            <span
              aria-hidden="true"
              className="text-champagne/60 shrink-0 mt-0.5"
            >
              —
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Text link CTA */}
      <Link
        href={offering.href}
        aria-label={`Explore ${offering.label}`}
        className="group/cta text-link !text-[11px] !tracking-[0.22em] text-champagne hover:text-cream mt-auto self-start inline-flex items-center gap-2 label-caps !text-[11px]"
      >
        Explore
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-cinematic group-hover/cta:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
}

export function HomeOfferings() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10 bg-background">
      <div className="container px-6">
        {/* Section header */}
        <header className="text-center mb-16 md:mb-20 max-w-xl mx-auto">
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
              The Offerings
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
            Three Ways to Listen
          </motion.h2>

          <motion.p
            className="mt-6 font-display italic text-sm md:text-base text-muted-foreground/70 leading-relaxed"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.2 }
            }
          >
            Whether the occasion calls for Bach or The Beatles, the craft is the
            same.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {offerings.map((offering) => (
            <OfferingCard key={offering.number} offering={offering} />
          ))}
        </div>
      </div>
    </section>
  );
}
