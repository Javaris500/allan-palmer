import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HomeHero } from "@/components/home/hero";
import { HomeAnchor } from "@/components/home/anchor";

// Above-the-fold: Hero + Anchor render immediately (hero is the first paint).
// Below-the-fold sections are lazy-loaded to keep the initial bundle lean.

const HomeOfferings = dynamic(
  () =>
    import("@/components/home/offerings").then((mod) => ({
      default: mod.HomeOfferings,
    })),
  { ssr: true },
);

const HomeSignature = dynamic(
  () =>
    import("@/components/home/signature").then((mod) => ({
      default: mod.HomeSignature,
    })),
  { ssr: true },
);

const HomePraise = dynamic(
  () =>
    import("@/components/home/praise").then((mod) => ({
      default: mod.HomePraise,
    })),
  { ssr: true },
);

const HomeGalleryTeaser = dynamic(
  () =>
    import("@/components/home/gallery-teaser").then((mod) => ({
      default: mod.HomeGalleryTeaser,
    })),
  { ssr: true },
);

const HomeClosing = dynamic(
  () =>
    import("@/components/home/closing").then((mod) => ({
      default: mod.HomeClosing,
    })),
  { ssr: true },
);

export const metadata: Metadata = {
  title: "Professional Violinist for Weddings & Events in Winnipeg",
  description:
    "Allan Palmer is a professional violinist in Winnipeg, Manitoba, specializing in weddings, corporate events, and private functions. Book elegant violin music for your special occasion or inquire about violin lessons.",
  keywords: [
    "wedding violinist Winnipeg",
    "corporate event music Manitoba",
    "professional violinist",
    "violin lessons Winnipeg",
    "live wedding music",
    "violinist for events",
    "event entertainment",
  ],
  openGraph: {
    title: "Allan Palmer | Professional Violinist for Weddings & Events",
    description:
      "Professional violinist specializing in weddings, corporate events, and private functions in Winnipeg, Manitoba.",
    type: "website",
    locale: "en_CA",
  },
  alternates: {
    canonical: "/",
  },
};

function SectionSkeleton() {
  return (
    <div
      className="py-24 animate-pulse"
      role="status"
      aria-label="Loading section"
    >
      <div className="container max-w-2xl">
        <div className="mx-auto mb-8 h-px w-16 bg-muted/40" />
        <div className="h-10 bg-muted/30 rounded-sm w-1/2 mx-auto mb-6" />
        <div className="h-3 bg-muted/20 rounded-sm w-2/3 mx-auto mb-2" />
        <div className="h-3 bg-muted/20 rounded-sm w-1/2 mx-auto" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* 1 — Cinematic hero with full-bleed video + stat strip */}
      <HomeHero />

      {/* 2 — The quiet anchor: a single line of intent */}
      <HomeAnchor />

      {/* 3 — Three Ways to Listen: the offerings */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeOfferings />
      </Suspense>

      {/* 4 — Signature piece: Over the Rainbow, playable */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeSignature />
      </Suspense>

      {/* 5 — Single-quote praise moment */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomePraise />
      </Suspense>

      {/* 6 — Gallery teaser: 8 curated tiles */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeGalleryTeaser />
      </Suspense>

      {/* 7 — Closing invocation */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeClosing />
      </Suspense>
    </>
  );
}
