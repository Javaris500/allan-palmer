// Hardcoded fallback gallery — used by the public /gallery page when the
// Photo table has no GALLERY_CAROUSEL rows, and consumed by the
// `db:seed-gallery` script to one-shot import these into the DB so
// admin can manage them.
//
// This file has zero React imports so it can be loaded from a plain Node
// script (`tsx scripts/seed-gallery-photos.ts`) without dragging in client
// dependencies.

export type CarouselPhoto = {
  id: number | string;
  src: string;
  alt: string;
  title: string;
  description: string;
};

export const defaultGalleryPhotos: CarouselPhoto[] = [
  {
    id: 1,
    src: "/images/gallery/IMG_9924.jpeg",
    alt: "Allan Palmer performing at elegant wedding ceremony",
    title: "Elegant Wedding Ceremony",
    description:
      "Creating magical moments at an upscale wedding with beautiful floral arrangements.",
  },
  {
    id: 2,
    src: "/images/gallery/IMG_9923.jpeg",
    alt: "Allan Palmer with bride and groom after wedding ceremony",
    title: "Wedding Celebration",
    description:
      "Celebrating with the happy couple after providing beautiful ceremony music.",
  },
  {
    id: 3,
    src: "/images/gallery/outdoor-ceremony-pavilion.png",
    alt: "Allan Palmer performing at outdoor wedding ceremony with pavilion",
    title: "Outdoor Ceremony Performance",
    description:
      "Performing for a large outdoor wedding ceremony in a picturesque pavilion setting.",
  },
  {
    id: 4,
    src: "/images/gallery/performance-1.jpeg",
    alt: "Allan Palmer Concert Performance",
    title: "Concert Performance",
    description:
      "Professional concert setting showcasing Allan's stage presence and violin mastery.",
  },
  {
    id: 5,
    src: "/images/gallery/performance-2.jpeg",
    alt: "Allan Palmer Sacred Music Performance",
    title: "Sacred Music Performance",
    description:
      "Beautiful church setting performance with ornate architectural backdrop.",
  },
  {
    id: 7,
    src: "/images/gallery/performance-3.jpeg",
    alt: "Allan Palmer Cathedral Concert",
    title: "Cathedral Concert",
    description:
      "Stunning Gothic cathedral performance demonstrating versatility in sacred spaces.",
  },
  {
    id: 8,
    src: "/images/about/IMG_9343.png",
    alt: "Allan Palmer Music Education",
    title: "Music Education",
    description:
      "Allan sharing his passion for violin through teaching and mentorship.",
  },
  {
    id: 9,
    src: "/images/gallery/IMG_9711.png",
    alt: "Allan Palmer performing in modern architectural setting",
    title: "Contemporary Venue Performance",
    description:
      "Professional performance in a sleek, modern architectural environment.",
  },
  {
    id: 10,
    src: "/images/gallery/IMG_9716.jpeg",
    alt: "Allan Palmer performing for intimate fire pit gathering",
    title: "Intimate Backyard Performance",
    description:
      "Creating a warm, personal atmosphere for a small gathering around the fire pit.",
  },
  {
    id: 11,
    src: "/images/gallery/IMG_9714.png",
    alt: "Allan Palmer performing at modern venue entrance",
    title: "Modern Venue Performance",
    description:
      "Elegant performance at a contemporary event space with striking architectural features.",
  },
  {
    id: 12,
    src: "/images/gallery/IMG_9345.jpeg",
    alt: "Allan Palmer performance moment",
    title: "Performance Moment",
    description:
      "Capturing the artistry and emotion of live violin performance.",
  },
  {
    id: 13,
    src: "/images/gallery/IMG_9338.png",
    alt: "Allan Palmer in performance setting",
    title: "Professional Performance",
    description:
      "Showcasing technical skill and musical expression in a professional setting.",
  },
  {
    id: 14,
    src: "/images/gallery/IMG_9342.png",
    alt: "Allan Palmer violin performance",
    title: "Musical Excellence",
    description:
      "Demonstrating the passion and precision that defines Allan's performances.",
  },
  {
    id: 15,
    src: "/images/gallery/formal-restaurant-performance.jpg",
    alt: "Allan Palmer performing in formal attire at upscale restaurant venue",
    title: "Elegant Dining Performance",
    description:
      "Black and white capture of a sophisticated performance in formal bow tie attire.",
  },
  {
    id: 16,
    src: "/images/gallery/wedding-reception-performance.jpg",
    alt: "Allan Palmer performing at wedding reception with guests",
    title: "Wedding Reception Entertainment",
    description:
      "Bringing joy and elegance to wedding celebrations with live violin music.",
  },
  {
    id: 17,
    src: "/images/gallery/stage-performance-lighting.png",
    alt: "Allan Palmer stage performance with dramatic green lighting",
    title: "Concert Stage Performance",
    description:
      "Dynamic stage performance showcasing Allan's versatility in concert settings.",
  },
  {
    id: 18,
    src: "/images/gallery/professional-navy-suit.jpg",
    alt: "Allan Palmer professional portrait in navy suit",
    title: "Professional Portrait",
    description:
      "Elegant professional performance in navy suit at modern venue.",
  },
  {
    id: 19,
    src: "/images/gallery/indian-wedding-ceremony.png",
    alt: "Allan Palmer performing at Indian wedding ceremony with bride and groom",
    title: "Indian Wedding Ceremony",
    description:
      "Elegant performance at a traditional Indian wedding with ornate decorations and crystal chandeliers.",
  },
  {
    id: 20,
    src: "/images/gallery/outdoor-garden-wedding.png",
    alt: "Allan Palmer with couple at outdoor garden wedding ceremony",
    title: "Garden Wedding Celebration",
    description:
      "Beautiful outdoor garden wedding with blue drapery and natural stone setting.",
  },
  {
    id: 21,
    src: "/images/gallery/countryside-wedding.png",
    alt: "Allan Palmer with couple in scenic countryside wedding setting",
    title: "Countryside Wedding",
    description:
      "Picturesque countryside wedding with rolling green hills and natural beauty.",
  },
  {
    id: 22,
    src: "/images/gallery/wedding-ceremony-performance.png",
    alt: "Allan Palmer performing during outdoor wedding ceremony for seated guests",
    title: "Live Wedding Performance",
    description:
      "Performing live violin music during an outdoor wedding ceremony for guests.",
  },
  {
    id: 23,
    src: "/images/gallery/outdoor-park-wedding.png",
    alt: "Allan Palmer with couple at outdoor park wedding",
    title: "Park Wedding Celebration",
    description:
      "Elegant outdoor park wedding celebration with professional violin accompaniment.",
  },
  {
    id: 24,
    src: "/images/gallery/outdoor-ceremony-golden-hour.jpeg",
    alt: "Allan Palmer performing for seated wedding guests at golden hour outdoor ceremony",
    title: "Golden Hour Ceremony",
    description:
      "Serenading guests during a stunning outdoor wedding ceremony at golden hour.",
  },
  {
    id: 25,
    src: "/images/gallery/autumn-garden-wedding.jpeg",
    alt: "Allan Palmer with bride and groom in an autumn garden setting",
    title: "Autumn Garden Wedding",
    description:
      "A beautiful autumn wedding celebration surrounded by rich fall foliage and warm colours.",
  },
  {
    id: 26,
    src: "/images/gallery/floral-arch-ceremony.jpeg",
    alt: "Allan Palmer performing under a floral arch at an outdoor wedding ceremony",
    title: "Floral Arch Performance",
    description:
      "Performing beneath an elegant floral arch under a clear blue sky.",
  },
  {
    id: 27,
    src: "/images/gallery/autumn-couple-portrait.jpeg",
    alt: "Allan Palmer with bride and groom among autumn foliage",
    title: "Fall Wedding Portrait",
    description:
      "Capturing a joyful moment with the happy couple amid vibrant autumn colours.",
  },
  {
    id: 28,
    src: "/images/gallery/urban-venue-portrait.jpeg",
    alt: "Allan Palmer playing violin at an outdoor urban venue with birch trees",
    title: "Urban Garden Performance",
    description:
      "Elegant outdoor performance at a modern urban venue surrounded by birch trees.",
  },
  {
    id: 29,
    src: "/images/gallery/ceremony-aisle-performance.jpeg",
    alt: "Allan Palmer walking the aisle performing violin at an outdoor wedding ceremony",
    title: "Aisle Processional",
    description:
      "Walking the aisle and serenading guests during a memorable outdoor wedding processional.",
  },
  {
    id: 30,
    src: "/images/gallery/pond-wedding-portrait.jpeg",
    alt: "Allan Palmer with bride and groom beside a lily pad pond",
    title: "Pond Side Wedding",
    description:
      "A lovely post-ceremony portrait with the newlyweds beside a serene lily pad pond.",
  },
];
