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
    label: "Gallery Carousel (Gallery page only)",
    description:
      "Photos shown on the dedicated /gallery page. These DO NOT appear on the homepage. To make a photo show on the homepage, upload it to \"Selected Stills (Homepage)\" below.",
    appearsOn: "Gallery page",
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
    label: "Selected Stills (Homepage)",
    description:
      "Photos shown in the \"Selected Stills\" section on the homepage (under the \"In Frame\" eyebrow). Add up to 8; your uploads appear first, with the largest tile reserved for your most recent. Upload here — NOT to \"Gallery Carousel\" — to make a photo show up on the homepage.",
    appearsOn: "Homepage — Selected Stills section",
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
