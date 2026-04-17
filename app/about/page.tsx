import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PageTransition } from "@/components/page-transition";
import { AboutHero } from "@/components/about/about-hero";

// Lazy load below-fold sections
const AboutTimeline = dynamic(
  () =>
    import("@/components/about/about-timeline").then((mod) => ({
      default: mod.AboutTimeline,
    })),
  { ssr: true },
);
const AboutPhilosophy = dynamic(
  () =>
    import("@/components/about/about-philosophy").then((mod) => ({
      default: mod.AboutPhilosophy,
    })),
  { ssr: true },
);
const AboutMedia = dynamic(
  () =>
    import("@/components/about/about-media").then((mod) => ({
      default: mod.AboutMedia,
    })),
  { ssr: true },
);

export const metadata: Metadata = {
  title: "About Allan Palmer - Professional Violinist & Music Educator",
  description:
    "Learn about Allan Palmer's musical journey from a 6-year-old beginner to a professional violinist, educator, and performer. Discover his background, training, and passion for music.",
  keywords: [
    "Allan Palmer biography",
    "professional violinist Winnipeg",
    "violin teacher Manitoba",
    "Suzuki method instructor",
    "University of Manitoba music",
    "Palms Music Studio",
    "Sistema teaching artist",
  ],
  openGraph: {
    title: "About Allan Palmer - Professional Violinist & Music Educator",
    description:
      "Discover Allan Palmer's musical journey from childhood to professional violinist and dedicated music educator in Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/about",
  },
};

function SectionSkeleton() {
  return (
    <div
      className="py-24 animate-pulse motion-reduce:animate-none"
      role="status"
      aria-label="Loading section"
    >
      <div className="container max-w-2xl">
        <div className="mx-auto mb-8 h-px w-16 bg-champagne/30" />
        <div className="h-10 bg-muted/30 rounded-sm w-1/2 mx-auto mb-6" />
        <div className="h-3 bg-muted/20 rounded-sm w-2/3 mx-auto mb-2" />
        <div className="h-3 bg-muted/20 rounded-sm w-1/2 mx-auto" />
      </div>
    </div>
  );
}

/**
 * Ornamental section break — f-hole motif + hairline + programme label.
 * Used between major About sections for brand-motif continuity and
 * visual breathing room (concert programme: a moment of silence between
 * movements).
 */
function SectionOrnament({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative container max-w-4xl py-10 md:py-14"
    >
      <div className="flex items-center justify-center gap-6 md:gap-8">
        <div className="h-px flex-1 bg-champagne/20" />
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/f-hole.svg"
            alt=""
            width={14}
            height={40}
            className="text-champagne/40 opacity-60"
          />
          <span className="label-caps !text-[9px] md:!text-[10px] !tracking-[0.4em] !text-champagne/55">
            {label}
          </span>
        </div>
        <div className="h-px flex-1 bg-champagne/20" />
      </div>
    </div>
  );
}

function AboutClosingCta() {
  return (
    <section className="relative py-24 md:py-32 border-t border-champagne/10">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <div className="divider-gold-sm mb-10" />

          <blockquote className="font-display italic font-light text-2xl md:text-[2rem] text-foreground/85 leading-[1.35] tracking-tight mb-10">
            Music for occasions that deserve to be remembered.
          </blockquote>

          <div className="flex items-center justify-center gap-8">
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
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <PageTransition>
      <AboutHero />
      <SectionOrnament label="Allan Palmer" />
      <Suspense fallback={<SectionSkeleton />}>
        <AboutTimeline />
      </Suspense>
      <SectionOrnament label="The Craft" />
      <Suspense fallback={<SectionSkeleton />}>
        <AboutPhilosophy />
      </Suspense>
      <SectionOrnament label="In His Own Words" />
      <Suspense fallback={<SectionSkeleton />}>
        <AboutMedia />
      </Suspense>
      <AboutClosingCta />
    </PageTransition>
  );
}
