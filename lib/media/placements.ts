import type { PhotoPlacement, VideoPlacement } from "@/generated/prisma";

export type PlacementMeta = {
  label: string;
  description: string;
  appearsOn: string;
  viewUrl: string;
  isSingleton: boolean;
  recommendedAspect?: string;
  recommendedSize?: string;
};

export const PHOTO_PLACEMENTS: Record<PhotoPlacement, PlacementMeta> = {
  GALLERY_CAROUSEL: {
    label: "Gallery Carousel",
    description:
      "Photos shown on the /gallery page. Your 8 most recent uploads here also appear in the homepage \"Selected Stills\" section by default — so just upload here and the photos will surface on both pages. To pin specific photos to the homepage instead, use \"Selected Stills (Homepage)\" below; anything there overrides the default.",
    appearsOn: "Gallery page + homepage Selected Stills",
    viewUrl: "/gallery",
    isSingleton: false,
    recommendedAspect: "4:3 or 16:9 landscape",
    recommendedSize: "Up to 4 MB each",
  },
  ABOUT_PORTRAIT: {
    label: "About — Portrait",
    description:
      "Allan's portrait shown on the About page hero. Replacing it updates the About page immediately. The previous portrait is moved to \"Not Placed Yet\" — delete it from there if you want it gone for good.",
    appearsOn: "About page hero",
    viewUrl: "/about",
    isSingleton: true,
    recommendedAspect: "3:4 portrait",
  },
  HOMEPAGE_HERO: {
    label: "Homepage Hero",
    description:
      "Background image on the homepage hero. Used as a fallback when no hero video is set. When you upload a new one, the old one is moved to \"Not Placed Yet\" — delete it from there to remove it permanently.",
    appearsOn: "Homepage hero",
    viewUrl: "/",
    isSingleton: true,
    recommendedAspect: "16:9 wide",
  },
  FEATURED_TEASER: {
    label: "Selected Stills (Homepage) — pinned",
    description:
      "Optional: pin specific photos to the homepage \"Selected Stills\" section. Anything here overrides the default (your most recent Gallery Carousel uploads). Leave empty to just show your latest gallery uploads automatically.",
    appearsOn: "Homepage — Selected Stills section (overrides default)",
    viewUrl: "/#selected-stills",
    isSingleton: false,
    recommendedAspect: "4:3 or 16:9",
  },
  UNUSED: {
    label: "Not Placed Yet",
    description: "Uploaded but not assigned to any section. Visitors won't see these.",
    appearsOn: "Not visible to visitors",
    viewUrl: "",
    isSingleton: false,
  },
};

export const VIDEO_PLACEMENTS: Record<VideoPlacement, PlacementMeta> = {
  GALLERY_GRID: {
    label: "Gallery Video Grid",
    description: "Performance videos shown on the gallery page video grid.",
    appearsOn: "Gallery page",
    viewUrl: "/gallery",
    isSingleton: false,
  },
  HOMEPAGE_HERO: {
    label: "Homepage Hero Video",
    description: "Background video on the homepage hero.",
    appearsOn: "Homepage hero",
    viewUrl: "/",
    isSingleton: true,
  },
  FEATURED_TEASER: {
    label: "Selected Stills (Homepage) — Video",
    description: "Featured video preview on the homepage Selected Stills area.",
    appearsOn: "Homepage — Selected Stills section",
    viewUrl: "/#selected-stills",
    isSingleton: false,
  },
  HOMEPAGE_ON_STAGE: {
    label: "Homepage — On Stage",
    description:
      "Performance videos shown stacked in the 'On Stage' section between Signature and Praise on the homepage. Add up to a few — display order controls top-to-bottom order.",
    appearsOn: "Homepage — On Stage section",
    viewUrl: "/",
    isSingleton: false,
    recommendedAspect: "16:9 landscape",
  },
  ABOUT_FEATURE: {
    label: "About — Featured Performance",
    description:
      "A single featured performance video shown below the podcast interview on the About page. Replacing it updates About immediately; the previous video moves to \"Not Placed Yet\".",
    appearsOn: "About page — In Conversation section",
    viewUrl: "/about",
    isSingleton: true,
    recommendedAspect: "16:9 landscape",
  },
  UNUSED: {
    label: "Not Placed Yet",
    description: "Uploaded but not assigned to any section. Visitors won't see this.",
    appearsOn: "Not visible to visitors",
    viewUrl: "",
    isSingleton: false,
  },
};

export const PHOTO_PLACEMENT_ORDER: PhotoPlacement[] = [
  "ABOUT_PORTRAIT",
  "HOMEPAGE_HERO",
  "GALLERY_CAROUSEL",
  "FEATURED_TEASER",
  "UNUSED",
];

export const VIDEO_PLACEMENT_ORDER: VideoPlacement[] = [
  "HOMEPAGE_HERO",
  "HOMEPAGE_ON_STAGE",
  "ABOUT_FEATURE",
  "GALLERY_GRID",
  "FEATURED_TEASER",
  "UNUSED",
];
