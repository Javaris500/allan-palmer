// Hardcoded fallbacks for placements that historically pointed at static
// /public/images files instead of the Photo table. The public components
// import these so the live site keeps rendering when those placements
// are empty in the DB; the admin seed route imports them so we can
// one-shot populate prod with the existing assets, after which Allan
// can manage them from /admin/media like any other placement.
//
// This file has zero React imports — it can be loaded from a plain
// server route, a client component, or a CLI script.

export type StaticPhotoAsset = {
  src: string;
  alt: string;
  title: string;
};

export const defaultAboutPortrait: StaticPhotoAsset = {
  src: "/images/allan-portrait-bw.jpeg",
  alt: "Allan Palmer, professional violinist",
  title: "Allan Palmer — Portrait",
};

export const defaultHomepageHeroPoster: StaticPhotoAsset = {
  src: "/images/hero-background-outdoor.jpeg",
  alt: "Allan Palmer performing outdoors",
  title: "Homepage Hero Background",
};

export const defaultFeaturedTeaserTiles: readonly StaticPhotoAsset[] = [
  {
    src: "/images/gallery/outdoor-ceremony-golden-hour.jpeg",
    alt: "Allan Palmer performing at an outdoor wedding ceremony at golden hour",
    title: "Golden Hour Ceremony",
  },
  {
    src: "/images/gallery/floral-arch-ceremony.jpeg",
    alt: "Allan Palmer under a floral arch",
    title: "Floral Arch",
  },
  {
    src: "/images/gallery/indian-wedding-ceremony.png",
    alt: "Allan Palmer at an Indian wedding ceremony",
    title: "Indian Ceremony",
  },
  {
    src: "/images/gallery/formal-restaurant-performance.jpg",
    alt: "Allan Palmer in formal attire at an upscale restaurant",
    title: "Elegant Dining",
  },
  {
    src: "/images/gallery/ceremony-aisle-performance.jpeg",
    alt: "Allan Palmer walking the aisle during a wedding processional",
    title: "Aisle Processional",
  },
  {
    src: "/images/gallery/stage-performance-lighting.png",
    alt: "Allan Palmer on stage with dramatic lighting",
    title: "Concert Stage",
  },
  {
    src: "/images/gallery/autumn-couple-portrait.jpeg",
    alt: "Allan Palmer with newlyweds in autumn foliage",
    title: "Autumn Portrait",
  },
  {
    src: "/images/gallery/performance-3.jpeg",
    alt: "Allan Palmer in a Gothic cathedral",
    title: "Cathedral Concert",
  },
] as const;
