"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LightboxImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [isLoading, setIsLoading] = useState(true);

  const nextImage = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const prevImage = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: images[currentIndex]?.title || "Gallery Image",
          text:
            images[currentIndex]?.description ||
            "Gallery image from Allan Palmer",
          url: window.location.href,
        });
      } catch {
        // Share cancelled or not supported - silently ignore
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prevImage, nextImage]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const currentImage = images[currentIndex] || {
    id: 0,
    src: "/placeholder.svg",
    alt: "Gallery image",
    title: "Gallery image",
    description: "",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="text-white min-w-0 flex-1 mr-4">
              <h3 className="text-base sm:text-lg font-semibold truncate">
                {currentImage?.title || "Gallery Image"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {typeof navigator !== "undefined" && "share" in navigator && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main image */}
        <div className="flex items-center justify-center h-full px-2 sm:px-4 pt-16 sm:pt-20 pb-20 sm:pb-24">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-7xl max-h-full w-full h-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              onLoad={() => setIsLoading(false)}
              priority
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Navigation arrows - hidden on mobile, use bottom nav instead */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        {/* Bottom info and navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
          {/* Description */}
          <div className="text-center text-white px-4 pt-4 pb-2">
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto line-clamp-2">
              {currentImage.description}
            </p>
          </div>

          {/* Navigation bar */}
          <div
            className="flex items-center justify-between px-4 pb-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm py-2 px-3 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-white/60 text-xs sm:text-sm tabular-nums">
              {currentIndex + 1} / {images.length}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm py-2 px-3 rounded-lg"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
