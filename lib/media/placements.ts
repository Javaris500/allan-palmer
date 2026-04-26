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
    description: "Photos in the main gallery slideshow visitors browse on the gallery page.",
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
    label: "Featured Teaser (Homepage)",
    description: "A small set of standout photos that appear on the homepage gallery teaser.",
    appearsOn: "Homepage — gallery teaser",
    viewUrl: "/#gallery",
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
    label: "Featured Teaser (Homepage)",
    description: "Featured video preview on the homepage.",
    appearsOn: "Homepage — featured section",
    viewUrl: "/",
    isSingleton: false,
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
  "GALLERY_GRID",
  "FEATURED_TEASER",
  "UNUSED",
];
