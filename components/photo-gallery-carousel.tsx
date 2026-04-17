"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Lightbox } from "@/components/ui/lightbox";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const photos = [
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

function getTileClass(index: number): string {
  // Hero feature tile
  if (index === 0) return "col-span-2 row-span-2";
  // Wide landscape tiles — cadence every 9
  if (index > 0 && index % 9 === 0) return "col-span-2";
  // Tall portrait tiles — cadence every 7
  if (index > 0 && index % 7 === 0) return "row-span-2";
  return "";
}

export function PhotoGalleryCarousel() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <div className="relative">
      {/* Masonry grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-[180px] md:auto-rows-[220px] lg:auto-rows-[240px]"
        role="list"
      >
        {photos.map((photo, index) => {
          const tileClass = getTileClass(index);
          const isHero = index === 0;

          return (
            <motion.button
              key={photo.id}
              role="listitem"
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open ${photo.title}`}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      ease: EASE_OUT,
                      delay: Math.min(index * 0.02, 0.3),
                    }
              }
              className={cn(
                "group relative overflow-hidden rounded-sm ring-1 ring-champagne/10 hover:ring-champagne/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-[box-shadow,transform] duration-500 ease-cinematic",
                tileClass,
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  isHero
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                }
                className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                priority={index < 3}
              />

              {/* Hover gradient + caption */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              />

              <div
                className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-cinematic motion-reduce:transition-none"
                aria-hidden="true"
              >
                <div className="h-px w-8 bg-champagne/80 mb-2" />
                <p className="font-display italic text-sm md:text-base text-cream leading-tight drop-shadow">
                  {photo.title}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Editorial footer */}
      <p className="mt-10 md:mt-12 text-center font-display italic text-xs md:text-sm text-muted-foreground/50 tracking-wide">
        A selection of {photos.length} images
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
