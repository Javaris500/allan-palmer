import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";

const ServicesComparisonChart = dynamic(
  () =>
    import("@/components/services-comparison-chart").then((mod) => ({
      default: mod.ServicesComparisonChart,
    })),
  {
    ssr: true,
    loading: () => (
      <div
        className="py-24 animate-pulse"
        role="status"
        aria-label="Loading comparison"
      >
        <div className="container">
          <div className="mx-auto mb-8 h-px w-16 bg-muted/40" />
          <div className="h-10 bg-muted/30 rounded-sm w-1/2 mx-auto mb-6" />
          <div className="max-w-5xl mx-auto h-[480px] bg-muted/20 rounded-sm mt-12" />
        </div>
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Professional Violin Services | Allan Palmer",
  description:
    "Professional violin services for weddings, corporate events, private functions, and music lessons in Winnipeg, Manitoba. Book Allan Palmer for your special occasion.",
  keywords: [
    "wedding violinist",
    "corporate event music",
    "private function entertainment",
    "violin lessons",
    "professional musician Winnipeg",
    "classical violin performance",
  ],
  openGraph: {
    title: "Professional Violin Services | Allan Palmer",
    description:
      "Professional violin services for weddings, corporate events, private functions, and music lessons in Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/services",
  },
};

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
// THREE OFFERINGS — editorial cards, not SaaS tiles
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
    tagline:
      "Elegant violin music for every chapter of the day — from aisle to last dance.",
    features: [
      "Ceremony music",
      "Processional & recessional",
      "Cocktail hour",
      "Reception entertainment",
      "First-dance arrangements",
    ],
    href: "/booking?service=weddings",
    featured: true,
  },
  {
    number: "02",
    label: "Private & Corporate",
    title: "Private Engagements",
    tagline:
      "Bespoke music for occasions that deserve to be remembered — intimate or grand.",
    features: [
      "Dinner parties & anniversaries",
      "Corporate galas & product launches",
      "Birthday & holiday celebrations",
      "Celebrations of life",
      "Custom song arrangements",
    ],
    href: "/booking?service=private",
  },
  {
    number: "03",
    label: "Lessons",
    title: "Violin Instruction",
    tagline:
      "Personalised lessons shaped to the player — beginner through advanced.",
    features: [
      "Beginner to advanced",
      "Classical & contemporary repertoire",
      "In-person & online sessions",
      "Personalised curriculum",
      "Performance opportunities",
    ],
    href: "/lessons",
  },
];

function OfferingCard({ offering }: { offering: Offering }) {
  return (
    <article
      className={
        "group relative flex flex-col h-full p-8 md:p-10 rounded-sm border " +
        (offering.featured
          ? "border-champagne/30 bg-champagne/[0.015]"
          : "border-champagne/15")
      }
    >
      {/* Ghost numeral — engraved feel */}
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
          <span className="ml-3 text-champagne/50 italic tracking-normal normal-case text-[10px] font-serif">
            · Most Requested
          </span>
        )}
      </p>

      {/* Title */}
      <h3 className="font-display font-light text-2xl md:text-3xl tracking-tight leading-[1.15] text-foreground mb-4">
        {offering.title}
      </h3>

      {/* Italic tagline */}
      <p className="font-display italic text-sm md:text-base text-muted-foreground/75 leading-relaxed mb-8">
        {offering.tagline}
      </p>

      {/* Gold hairline separator */}
      <div className="h-px w-8 bg-champagne/40 mb-6" />

      {/* Em-dash feature list — programme style */}
      <ul className="space-y-2.5 mb-10 flex-1">
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
        className="text-link !text-[11px] !tracking-[0.22em] text-champagne hover:text-cream mt-auto self-start inline-flex items-center gap-2 label-caps !text-[11px]"
      >
        Explore
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-cinematic group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </article>
  );
}

// ═══════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════
export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Cinematic header */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--gold)/0.05)_0%,transparent_70%)]" />
          </div>
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <SectionEyebrow label="The Offerings" />
              <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
                Engagements
              </h1>
              <p className="mt-8 font-display italic text-base md:text-lg text-muted-foreground/80 leading-relaxed max-w-xl mx-auto">
                Music for weddings, private events, and instruction — shaped to
                the occasion, honoured to the last note.
              </p>
              <div className="divider-gold-sm mt-10" />
            </div>
          </div>
        </section>

        {/* Three editorial offering cards */}
        <section className="pb-16 md:pb-24">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
              {offerings.map((offering) => (
                <OfferingCard key={offering.number} offering={offering} />
              ))}
            </div>

            {/* Bespoke-pricing note */}
            <p className="mt-12 md:mt-14 text-center font-display italic text-xs md:text-sm text-muted-foreground/55 max-w-xl mx-auto">
              Pricing is tailored to each engagement — Allan will prepare a
              bespoke quote following a brief conversation about your occasion.
            </p>
          </div>
        </section>

        {/* Comparison chart */}
        <ServicesComparisonChart />

        {/* Closing CTA */}
        <section className="py-24 md:py-32 border-t border-champagne/10">
          <div className="container max-w-xl text-center">
            <div className="divider-gold-sm mb-10" />
            <blockquote className="font-display italic font-light text-2xl md:text-[2rem] text-foreground/85 leading-[1.35] tracking-tight mb-10">
              Every occasion is unique. Let&rsquo;s find the right music for
              yours.
            </blockquote>
            <div className="flex items-center justify-center gap-8">
              <Link
                href="/booking"
                className="inline-block bg-gold hover:bg-champagne text-ink px-8 py-3.5 rounded-sm text-[11px] md:text-xs tracking-[0.22em] uppercase font-label transition-colors duration-500 ease-cinematic"
              >
                Book Allan
              </Link>
              <Link
                href="/contact"
                className="text-link !text-[11px] !tracking-[0.22em] text-muted-foreground hover:text-champagne"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
