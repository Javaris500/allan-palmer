"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
interface ServiceCategory {
  id: string;
  name: string;
  shortName: string;
}

interface Feature {
  id: string;
  name: string;
  category: string;
  availability: {
    weddings: boolean | "optional";
    private: boolean | "optional";
    lessons: boolean | "optional";
  };
}

const serviceCategories: ServiceCategory[] = [
  { id: "weddings", name: "Weddings", shortName: "Weddings" },
  { id: "private", name: "Private & Corporate", shortName: "Private" },
  { id: "lessons", name: "Lessons", shortName: "Lessons" },
];

const features: Feature[] = [
  // Event Types — Weddings
  {
    id: "ceremony",
    name: "Ceremony Music",
    category: "Event Types",
    availability: { weddings: true, private: false, lessons: false },
  },
  {
    id: "processional",
    name: "Processional & Recessional",
    category: "Event Types",
    availability: { weddings: true, private: false, lessons: false },
  },
  {
    id: "cocktail",
    name: "Cocktail Hour",
    category: "Event Types",
    availability: { weddings: true, private: true, lessons: false },
  },
  {
    id: "reception",
    name: "Reception Entertainment",
    category: "Event Types",
    availability: { weddings: true, private: true, lessons: false },
  },
  {
    id: "first-dance",
    name: "First Dance Music",
    category: "Event Types",
    availability: { weddings: true, private: false, lessons: false },
  },
  {
    id: "bridal-shower",
    name: "Bridal Showers",
    category: "Event Types",
    availability: { weddings: true, private: false, lessons: false },
  },
  {
    id: "bachelorette",
    name: "Bachelorette Parties",
    category: "Event Types",
    availability: { weddings: true, private: false, lessons: false },
  },

  // Event Types — Private/Corporate
  {
    id: "dinner-party",
    name: "Dinner Parties",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "birthday",
    name: "Birthday Celebrations",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "anniversary",
    name: "Anniversaries",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "proposal",
    name: "Proposals",
    category: "Event Types",
    availability: { weddings: true, private: true, lessons: false },
  },
  {
    id: "memorial",
    name: "Celebrations of Life & Memorials",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "baby-shower",
    name: "Baby Showers",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "corporate",
    name: "Corporate Events & Galas",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "product-launch",
    name: "Product Launches",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "holiday",
    name: "Holiday Parties",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },
  {
    id: "nursing-home",
    name: "Nursing Home Performances",
    category: "Event Types",
    availability: { weddings: false, private: true, lessons: false },
  },

  // Performance Features
  {
    id: "custom-arrangements",
    name: "Custom Song Arrangements",
    category: "Performance Features",
    availability: { weddings: true, private: true, lessons: false },
  },
  {
    id: "amplification",
    name: "Amplification Available",
    category: "Performance Features",
    availability: { weddings: true, private: true, lessons: false },
  },
  {
    id: "multi-location",
    name: "Multiple Location Setup",
    category: "Performance Features",
    availability: { weddings: true, private: "optional", lessons: false },
  },
  {
    id: "classical",
    name: "Classical Repertoire",
    category: "Performance Features",
    availability: { weddings: true, private: true, lessons: true },
  },
  {
    id: "contemporary",
    name: "Contemporary & Pop",
    category: "Performance Features",
    availability: { weddings: true, private: true, lessons: true },
  },

  // Lesson Features
  {
    id: "beginner",
    name: "Beginner Instruction",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "advanced",
    name: "Advanced Instruction",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "online",
    name: "Online Sessions Available",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "in-person",
    name: "In-Person Sessions",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "curriculum",
    name: "Personalized Curriculum",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "practice-plans",
    name: "Structured Practice Plans",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "digital-materials",
    name: "Digital Learning Materials",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
  {
    id: "performance-opps",
    name: "Performance Opportunities",
    category: "Lesson Features",
    availability: { weddings: false, private: false, lessons: true },
  },
];

const featuresByCategory = features.reduce(
  (acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category]!.push(feature);
    return acc;
  },
  {} as Record<string, Feature[]>,
);

// ═══════════════════════════════════════════════════════
// Typographic availability marks — programme notation
// ●  = included     ○  = on request     (blank) = not applicable
// ═══════════════════════════════════════════════════════
function AvailabilityMark({
  available,
  label,
}: {
  available: boolean | "optional";
  label: string;
}) {
  if (available === true) {
    return (
      <span
        aria-label={`${label}: included`}
        className="inline-block text-champagne text-base leading-none tabular-nums"
      >
        ●
      </span>
    );
  }
  if (available === "optional") {
    return (
      <span
        aria-label={`${label}: on request`}
        className="inline-block text-champagne/55 text-base leading-none tabular-nums"
      >
        ○
      </span>
    );
  }
  return (
    <span aria-label={`${label}: not applicable`} className="inline-block">
      <span
        aria-hidden="true"
        className="inline-block w-2 h-px bg-foreground/15 align-middle"
      />
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// Section eyebrow
// ═══════════════════════════════════════════════════════
function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <div className="h-px w-10 md:w-16 bg-champagne/50" />
      <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.35em]">
        {label}
      </span>
      <div className="h-px w-10 md:w-16 bg-champagne/50" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Highlight trio — bordered-left text blocks, no icons
// ═══════════════════════════════════════════════════════
const highlights = [
  {
    label: "Tailored",
    title: "Personalised Service",
    description:
      "Every engagement receives dedicated attention and custom arrangements shaped to your vision.",
  },
  {
    label: "Available",
    title: "Flexible Scheduling",
    description:
      "Bookings accepted year-round, with care taken to accommodate rehearsals and multi-location setups.",
  },
  {
    label: "Travel",
    title: "Winnipeg & Beyond",
    description:
      "Based in Winnipeg, Manitoba — and willing to travel for events of note across the region.",
  },
];

// ═══════════════════════════════════════════════════════
// CHART
// ═══════════════════════════════════════════════════════
export function ServicesComparisonChart() {
  const reduced = useReducedMotion();
  const viewOnce = { once: true, margin: "-80px" } as const;

  return (
    <section className="py-20 md:py-28 border-t border-champagne/10">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-14 md:mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewOnce}
            transition={
              reduced ? { duration: 0 } : { duration: 0.8, ease: EASE_OUT }
            }
          >
            <SectionEyebrow label="At a Glance" />
          </motion.div>

          <motion.h2
            className="font-display font-light text-3xl md:text-5xl tracking-tight leading-[1.05]"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewOnce}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.1 }
            }
          >
            Every Offering in Full
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
            A complete programme — mark included pieces with ●, on-request with
            ○.
          </motion.p>
        </header>

        {/* Comparison table — bare, hairline-ruled */}
        <motion.div
          className="max-w-5xl mx-auto overflow-x-auto"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.25 }
          }
        >
          <div className="min-w-[640px]">
            {/* Column headers — small-caps labels on hairline */}
            <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] border-b border-champagne/30 pb-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
              <div className="px-2 md:px-4">
                <span className="label-caps !text-[10px] !tracking-[0.3em]">
                  Feature
                </span>
              </div>
              {serviceCategories.map((category) => (
                <div key={category.id} className="px-2 md:px-4 text-center">
                  <span className="label-caps !text-[10px] md:!text-[11px] !tracking-[0.25em]">
                    <span className="hidden md:inline">{category.name}</span>
                    <span className="md:hidden">{category.shortName}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Body */}
            {Object.entries(featuresByCategory).map(
              ([categoryName, categoryFeatures]) => (
                <div key={categoryName} className="mt-10 first:mt-8">
                  {/* Category heading — small-caps gold over hairline */}
                  <div className="mb-4 pb-3 border-b border-champagne/15">
                    <span className="label-caps !text-[10px] !tracking-[0.3em]">
                      {categoryName}
                    </span>
                  </div>

                  {/* Feature rows */}
                  <div>
                    {categoryFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className={cn(
                          "grid grid-cols-[1.7fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] py-3 border-b border-border/15 hover:border-champagne/30 transition-colors duration-300",
                        )}
                      >
                        <div className="px-2 md:px-4 flex items-center">
                          <span className="font-display text-sm md:text-[15px] text-foreground/85 leading-snug">
                            {feature.name}
                          </span>
                        </div>
                        <div className="px-2 md:px-4 flex items-center justify-center">
                          <AvailabilityMark
                            available={feature.availability.weddings}
                            label={`Weddings — ${feature.name}`}
                          />
                        </div>
                        <div className="px-2 md:px-4 flex items-center justify-center">
                          <AvailabilityMark
                            available={feature.availability.private}
                            label={`Private — ${feature.name}`}
                          />
                        </div>
                        <div className="px-2 md:px-4 flex items-center justify-center">
                          <AvailabilityMark
                            available={feature.availability.lessons}
                            label={`Lessons — ${feature.name}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </motion.div>

        {/* Legend — inline editorial */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.35 }
          }
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="text-champagne text-base leading-none"
            >
              ●
            </span>
            <span className="font-display italic text-xs md:text-sm text-muted-foreground/70">
              Included
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="text-champagne/55 text-base leading-none"
            >
              ○
            </span>
            <span className="font-display italic text-xs md:text-sm text-muted-foreground/70">
              On request
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block w-2 h-px bg-foreground/25 align-middle"
            />
            <span className="font-display italic text-xs md:text-sm text-muted-foreground/70">
              Not applicable
            </span>
          </div>
        </motion.div>

        {/* Highlight trio — bordered-left editorial blocks */}
        <motion.div
          className="mt-24 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.1 }
          }
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="border-l-[1.5px] border-champagne/40 pl-6"
            >
              <p className="label-caps !text-[10px] !tracking-[0.3em] mb-3">
                {item.label}
              </p>
              <h3 className="font-display font-light text-xl md:text-2xl text-foreground/90 mb-3 tracking-tight leading-snug">
                {item.title}
              </h3>
              <p className="font-display italic text-sm text-muted-foreground/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Section CTA */}
        <motion.div
          className="mt-20 md:mt-24 text-center max-w-xl mx-auto"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewOnce}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE_OUT, delay: 0.2 }
          }
        >
          <div className="divider-gold-sm mb-8" />
          <p className="font-display italic text-base md:text-lg text-muted-foreground/75 leading-relaxed mb-8">
            Every occasion is unique — Allan will prepare a bespoke proposal
            after a brief conversation about your event.
          </p>
          <div className="flex items-center justify-center gap-8">
            <Link
              href="/booking"
              className="inline-block bg-gold hover:bg-champagne text-ink px-8 py-3.5 rounded-sm text-[11px] md:text-xs tracking-[0.22em] uppercase font-label transition-colors duration-500 ease-cinematic"
            >
              Begin a Booking
            </Link>
            <Link
              href="/gallery"
              className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
            >
              View Gallery
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
