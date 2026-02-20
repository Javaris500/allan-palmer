"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Play, ImageIcon, Film } from "lucide-react"
import { PhotoGalleryCarousel } from "./photo-gallery-carousel"
import { VideoThumbnailGrid } from "./video-thumbnail-grid"

type TabType = "photos" | "videos"

export function GalleryTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("photos")

  const tabs = [
    { 
      id: "photos" as TabType, 
      label: "Photos", 
      icon: Camera,
      count: 23,
      description: "Performance photography"
    },
    { 
      id: "videos" as TabType, 
      label: "Videos", 
      icon: Play,
      count: 24,
      description: "Live performances"
    },
  ]

  return (
    <div className="space-y-10">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex bg-muted/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive 
                    ? "text-black" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gold rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-black/20" : "bg-muted"
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Tab Description */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "photos" ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-gold">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Photo Gallery</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold">
                  Capturing Every Performance
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Browse through stunning photographs from weddings, concerts, and special events
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-gold">
                  <Film className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Video Gallery</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold">
                  See Allan in Action
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience the artistry through captivating video performances
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "photos" ? (
            <PhotoGalleryCarousel />
          ) : (
            <VideoThumbnailGrid />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
