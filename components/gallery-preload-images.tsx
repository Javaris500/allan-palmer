"use client"

import React from 'react'

export function GalleryPreloadImages() {
  return (
    <div className="hidden">
      {/* Preload the images */}
      <img 
        src="/images/gallery/wedding-couple-dance.jpg" 
        alt="Preload wedding couple dance"
        width={1} 
        height={1}
      />
      <img 
        src="/images/gallery/performer-closeup.jpg" 
        alt="Preload performer closeup"
        width={1} 
        height={1}
      />
    </div>
  )
}