"use client"

import Image from "next/image"

export function GalleryPreloadImages() {
  return (
    <div className="hidden" aria-hidden="true">
      {/* Preload gallery images for better performance */}
      <Image 
        src="/images/gallery/IMG_9924.jpeg" 
        alt=""
        width={1} 
        height={1}
        priority
      />
      <Image 
        src="/images/gallery/IMG_9923.jpeg" 
        alt=""
        width={1} 
        height={1}
        priority
      />
    </div>
  )
}