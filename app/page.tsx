import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HomeHero, type HomeHeroPoster } from "@/components/home/hero";
import { HomeAnchor } from "@/components/home/anchor";
import {
  rhythmSize,
  type TeaserTile,
} from "@/components/home/gallery-teaser";
import { getPhotosByPlacement, getSingletonPhoto } from "@/lib/media/photos";
import { getVideosByPlacement } from "@/lib/media/videos";

// Render on every request so admin uploads (hero, on-stage videos,
// featured teaser tiles) surface within seconds. revalidateTag wasn't
// reliably busting the prerendered HTML in production — Allan would
// upload a photo, see it in /admin/media, and not on the homepage.
export const revalidate = 0;

const ON_STAGE_FALLBACK_IDS = [
  "IbkO01rMhCQeGAlIuUsravD6jyqBa012lpyu46mtZg1As",
  "nQ1pnPAn01veA18yCqq67wJkEXuyo8phQhuOF6RqVgMM",
];

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

const HomeOnStage = dynamic(
  () =>
    import("@/components/home/on-stage").then((mod) => ({
      default: mod.HomeOnStage,
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

async function loadHeroPoster(): Promise<HomeHeroPoster | undefined> {
  try {
    const row = await getSingletonPhoto("HOMEPAGE_HERO");
    if (!row) return undefined;
    return { src: row.blobUrl, alt: row.altText };
  } catch (err) {
    console.error("[home] hero poster query failed, using fallback:", err);
    return undefined;
  }
}

async function loadHeroVideoId(): Promise<string | undefined> {
  try {
    const rows = await getVideosByPlacement("HOMEPAGE_HERO");
    return rows[0]?.muxPlaybackId;
  } catch (err) {
    console.error("[home] hero video query failed, using fallback:", err);
    return undefined;
  }
}

async function loadOnStageIds(): Promise<string[]> {
  try {
    const rows = await getVideosByPlacement("HOMEPAGE_ON_STAGE");
    if (rows.length === 0) return ON_STAGE_FALLBACK_IDS;
    return rows.map((r) => r.muxPlaybackId);
  } catch (err) {
    console.error("[home] on-stage videos query failed, using fallback:", err);
    return ON_STAGE_FALLBACK_IDS;
  }
}

async function loadTeaserTiles(): Promise<TeaserTile[] | undefined> {
  // Allan kept uploading to "Gallery Carousel" expecting them to surface on
  // the homepage Selected Stills section. They wouldn't, because the homepage
  // only read from FEATURED_TEASER. Now we fall through: curated
  // FEATURED_TEASER wins when set, otherwise the most recent GALLERY_CAROUSEL
  // uploads stand in. Static fixtures still kick in when both are empty.
  try {
    const curated = await getPhotosByPlacement("FEATURED_TEASER");
    const source =
      curated.length > 0
        ? curated
        : (await getPhotosByPlacement("GALLERY_CAROUSEL")).slice(0, 8);
    if (source.length === 0) return undefined;
    return source.map((row, index) => ({
      src: row.blobUrl,
      alt: row.altText,
      title: row.title,
      size: rhythmSize(index),
    }));
  } catch (err) {
    console.error("[home] teaser tiles query failed, using fallback:", err);
    return undefined;
  }
}

export default async function Home() {
  const [posterOverride, heroVideoId, teaserTiles, onStageIds] = await Promise.all([
    loadHeroPoster(),
    loadHeroVideoId(),
    loadTeaserTiles(),
    loadOnStageIds(),
  ]);

  return (
    <>
      {/* 1 — Cinematic hero with full-bleed video + stat strip */}
      <HomeHero posterOverride={posterOverride} videoPlaybackId={heroVideoId} />

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

      {/* 5 — On Stage: featured performance videos */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeOnStage playbackIds={onStageIds} />
      </Suspense>

      {/* 6 — Single-quote praise moment */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomePraise />
      </Suspense>

      {/* 6 — Gallery teaser: 8 curated tiles */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeGalleryTeaser tiles={teaserTiles} />
      </Suspense>

      {/* 7 — Closing invocation */}
      <Suspense fallback={<SectionSkeleton />}>
        <HomeClosing />
      </Suspense>
    </>
  );
}
