"use client"

import React from 'react'

export function GalleryPreloadImages() {
  return (
    <div className="hidden">
      {/* Preload the images */}
      <img 
        src="/images/gallery/IMG_9924.jpeg" 
        alt="Preload first gallery image"
        width={1} 
        height={1}
      />
      <img 
        src="/images/gallery/IMG_9923.jpeg" 
        alt="Preload second gallery image"
        width={1} 
        height={1}
      />
    </div>
  )
}