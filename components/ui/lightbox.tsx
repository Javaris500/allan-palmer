"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Image from "next/image";
import { EASE_OUT } from "@/lib/motion";

interface LightboxImage {
  id: number | string;
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
  const reduced = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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
        // Share cancelled or not supported — silently ignore
      }
    }
  };

  // Keyboard nav
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

  // Lock body scroll, hide floating nav, focus close button
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-fullscreen-overlay", "true");
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.removeAttribute("data-fullscreen-overlay");
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
        role="dialog"
        aria-modal="true"
        aria-label={currentImage.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={
          reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }
        }
        className="fixed inset-0 z-50 bg-[hsl(var(--bg))]/96 backdrop-blur-md backdrop-saturate-50"
        onClick={onClose}
      >
        {/* Corner ornament — thin-stroke X close (top-right) */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-1">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              aria-label="Share image"
              className="group w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
            >
              <Share2
                className="w-4 h-4 text-cream/70 group-hover:text-champagne transition-colors duration-300"
                strokeWidth={1.5}
              />
            </button>
          )}

          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close lightbox"
            className="group relative w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
          >
            <span
              className="absolute w-5 h-px bg-cream/70 rotate-45 group-hover:bg-champagne transition-colors duration-300 ease-cinematic"
              aria-hidden="true"
            />
            <span
              className="absolute w-5 h-px bg-cream/70 -rotate-45 group-hover:bg-champagne transition-colors duration-300 ease-cinematic"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Main image area */}
        <div className="flex items-center justify-center h-full px-4 sm:px-8 pt-16 sm:pt-20 pb-36 sm:pb-40">
          <motion.div
            key={currentIndex}
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }
            }
            className="relative max-w-6xl max-h-full w-full h-full"
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
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-cream/20 border-t-champagne motion-reduce:animate-none" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Thin-stroke navigation arrows — desktop only */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          aria-label="Previous image"
          className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-champagne/40 bg-black/20 backdrop-blur-sm text-cream/80 hover:text-ink hover:bg-champagne hover:border-champagne transition-colors duration-300 ease-cinematic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          aria-label="Next image"
          className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-champagne/40 bg-black/20 backdrop-blur-sm text-cream/80 hover:text-ink hover:bg-champagne hover:border-champagne transition-colors duration-300 ease-cinematic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Museum placard — bottom */}
        <div
          className="absolute bottom-0 inset-x-0 pb-8"
          style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="max-w-xl mx-auto px-5 text-center">
            <div className="h-px w-12 bg-champagne/50 mx-auto mb-4" />

            <p className="label-caps !text-[10px] md:!text-[11px] !tracking-[0.3em] mb-3">
              {currentImage.title}
            </p>

            {currentImage.description && (
              <p className="font-display italic text-xs sm:text-sm text-cream/60 leading-relaxed line-clamp-2 mb-4">
                {currentImage.description}
              </p>
            )}

            {/* Mobile nav — text links */}
            <div className="flex sm:hidden items-center justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Previous image"
                className="label-caps !text-[10px] !tracking-[0.2em] !text-cream/70 hover:!text-champagne transition-colors inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                Prev
              </button>

              <span className="font-display italic text-xs text-cream/50 tabular-nums">
                {currentIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
                className="label-caps !text-[10px] !tracking-[0.2em] !text-cream/70 hover:!text-champagne transition-colors inline-flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Desktop counter */}
            <p className="hidden sm:block font-display italic text-xs text-cream/45 tabular-nums">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
