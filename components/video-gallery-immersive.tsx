"use client";

import { useState, useRef, useEffect } from "react";
import { MuxVideoPlayer } from "./mux-video-player";
import { getAllVideoConfigs, VideoConfig } from "@/lib/video-thumbnails";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const getReelThumbnail = (playbackId: string, time: number = 10) =>
  `https://image.mux.com/${playbackId}/thumbnail.png?width=400&height=712&time=${time}&fit_mode=crop`;

const getLandscapeThumbnail = (playbackId: string, time: number = 10) =>
  `https://image.mux.com/${playbackId}/thumbnail.png?width=400&height=225&time=${time}&fit_mode=crop`;

export function VideoGalleryImmersive({
  videos,
}: {
  videos?: VideoConfig[];
} = {}) {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(
    null,
  );
  const allVideos = videos && videos.length > 0 ? videos : getAllVideoConfigs();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const reduced = useReducedMotion();

  const selectedVideo =
    selectedVideoIndex !== null ? allVideos[selectedVideoIndex] : null;

  const checkScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener("scroll", checkScrollState);
    window.addEventListener("resize", checkScrollState);
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const goToPrevVideo = () => {
    if (selectedVideoIndex !== null && selectedVideoIndex > 0) {
      setSelectedVideoIndex(selectedVideoIndex - 1);
    }
  };

  const goToNextVideo = () => {
    if (
      selectedVideoIndex !== null &&
      selectedVideoIndex < allVideos.length - 1
    ) {
      setSelectedVideoIndex(selectedVideoIndex + 1);
    }
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * allVideos.length);
    setSelectedVideoIndex(randomIndex);
  };

  // Hide floating nav & lock scroll in theater mode
  useEffect(() => {
    if (selectedVideo) {
      document.documentElement.setAttribute("data-fullscreen-overlay", "true");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.removeAttribute("data-fullscreen-overlay");
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.removeAttribute("data-fullscreen-overlay");
      document.body.style.overflow = "";
    };
  }, [selectedVideo]);

  // Esc / Arrow keys
  useEffect(() => {
    if (!selectedVideo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedVideoIndex(null);
      if (e.key === "ArrowLeft") goToPrevVideo();
      if (e.key === "ArrowRight") goToNextVideo();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideo, selectedVideoIndex]);

  // ═══════════════════════════════════════════════════════
  // THEATER MODE
  // ═══════════════════════════════════════════════════════
  if (selectedVideo) {
    return (
      <AnimatePresence>
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${selectedVideo.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }
          }
          className="fixed inset-0 bg-background z-50 flex"
        >
          {/* Main video area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between p-5 md:p-6 bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0 z-10">
              <div className="min-w-0 flex-1 pr-4">
                {selectedVideo.category && (
                  <p className="label-caps !text-[10px] !tracking-[0.3em] mb-2">
                    {selectedVideo.category}
                  </p>
                )}
                <h3 className="font-display font-light text-xl md:text-2xl tracking-tight leading-tight truncate text-cream">
                  {selectedVideo.title.replace("Allan Palmer - ", "")}
                </h3>
              </div>

              {/* Thin-stroke X close — editorial corner ornament */}
              <button
                type="button"
                onClick={() => setSelectedVideoIndex(null)}
                aria-label="Close video"
                className="group relative w-10 h-10 flex-shrink-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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

            {/* Video */}
            <div className="flex-1 flex items-center justify-center p-4 pt-20 pb-24 md:pb-28 min-h-0">
              <div className="w-full h-full max-w-6xl flex items-center justify-center">
                <MuxVideoPlayer
                  playbackId={selectedVideo.playbackId}
                  className="max-h-full max-w-full"
                  priority
                  fluid
                />
              </div>
            </div>

            {/* Bottom navigation */}
            <div
              className="px-5 md:px-8 pt-4 pb-8 bg-gradient-to-t from-black/70 to-transparent absolute bottom-0 left-0 right-0 z-20"
              style={{
                paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
              }}
            >
              {selectedVideo.description && (
                <p className="font-display italic text-xs sm:text-sm text-cream/60 max-w-3xl mb-4 line-clamp-2 leading-relaxed">
                  {selectedVideo.description}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goToPrevVideo}
                  disabled={selectedVideoIndex === 0}
                  className="group inline-flex items-center gap-2 label-caps !text-[11px] !tracking-[0.2em] !text-cream/70 hover:!text-champagne disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300 ease-cinematic"
                >
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-6">
                  <span className="font-display italic text-xs sm:text-sm text-cream/50 tabular-nums">
                    {selectedVideoIndex !== null ? selectedVideoIndex + 1 : 0}
                    {" / "}
                    {allVideos.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleSurpriseMe}
                    aria-label="Play a random video"
                    className="group inline-flex items-center gap-2 label-caps !text-[11px] !tracking-[0.2em] !text-champagne/80 hover:!text-champagne transition-colors duration-300 ease-cinematic"
                  >
                    <Shuffle className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Shuffle</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={goToNextVideo}
                  disabled={selectedVideoIndex === allVideos.length - 1}
                  className="group inline-flex items-center gap-2 label-caps !text-[11px] !tracking-[0.2em] !text-cream/70 hover:!text-champagne disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300 ease-cinematic"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar — "Up Next" programme list */}
          <aside className="hidden lg:flex flex-col w-80 bg-background/95 border-l border-champagne/10 overflow-hidden">
            <div className="p-5 border-b border-champagne/10">
              <p className="label-caps !text-[10px] !tracking-[0.3em]">
                Up Next
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {allVideos.map((video, index) => {
                const isActive = index === selectedVideoIndex;
                return (
                  <button
                    key={video.playbackId}
                    type="button"
                    onClick={() => setSelectedVideoIndex(index)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "w-full flex gap-3 p-2 rounded-sm text-left transition-colors duration-300 ease-cinematic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/60",
                      isActive
                        ? "bg-champagne/[0.08]"
                        : "hover:bg-white/[0.04]",
                    )}
                  >
                    <div
                      className={cn(
                        "relative w-28 h-16 rounded-sm overflow-hidden flex-shrink-0 bg-gray-800",
                        isActive && "ring-1 ring-champagne/50",
                      )}
                    >
                      <Image
                        src={getLandscapeThumbnail(
                          video.playbackId,
                          video.thumbnailTime || 10,
                        )}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {video.category && (
                        <p className="label-caps !text-[9px] !tracking-[0.2em] mb-1">
                          {video.category}
                        </p>
                      )}
                      <p
                        className={cn(
                          "font-display text-sm leading-snug line-clamp-2 transition-colors duration-300 ease-cinematic",
                          isActive ? "text-champagne" : "text-cream/90",
                        )}
                      >
                        {video.title.replace("Allan Palmer - ", "")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ═══════════════════════════════════════════════════════
  // REEL GALLERY
  // ═══════════════════════════════════════════════════════
  return (
    <div className="space-y-8">
      {/* Header row */}
      <div className="flex items-baseline justify-between">
        <p className="font-display italic text-xs md:text-sm text-muted-foreground/60">
          A selection of {allVideos.length} performances
        </p>
        <button
          type="button"
          onClick={handleSurpriseMe}
          aria-label="Play a random video"
          className="group inline-flex items-center gap-2 label-caps !text-[11px] !tracking-[0.2em] !text-champagne/80 hover:!text-champagne transition-colors duration-300 ease-cinematic"
        >
          <Shuffle className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Horizontal reel scroll */}
      <div className="relative group/carousel">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
            >
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll reels left"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-champagne/40 text-champagne bg-background/70 hover:bg-champagne hover:text-ink hover:border-champagne transition-colors duration-300 ease-cinematic ml-2 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
            >
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll reels right"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-champagne/40 text-champagne bg-background/70 hover:bg-champagne hover:text-ink hover:border-champagne transition-colors duration-300 ease-cinematic mr-2 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />
        )}

        {/* Reel rail */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {allVideos.map((video, index) => (
            <motion.div
              key={video.playbackId}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      ease: EASE_OUT,
                      delay: Math.min(index * 0.03, 0.3),
                    }
              }
              className="flex-shrink-0 snap-start"
            >
              <ReelCard
                video={video}
                onClick={() => setSelectedVideoIndex(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// REEL CARD — editorial, not Spotify playlist
// ═══════════════════════════════════════════════════════
function ReelCard({
  video,
  onClick,
}: {
  video: VideoConfig;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Watch ${video.title}`}
      className="group relative w-[200px] sm:w-[220px] md:w-[240px] rounded-sm overflow-hidden ring-1 ring-champagne/10 hover:ring-champagne/40 transition-[box-shadow] duration-500 ease-cinematic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[9/16] w-full bg-gray-900">
        <Image
          src={getReelThumbnail(video.playbackId, video.thumbnailTime || 10)}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, 240px"
        />

        {/* Bottom gradient for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
          aria-hidden="true"
        />

        {/* Category label — replaces Spotify-style number badge */}
        {video.category && (
          <p className="absolute top-3 left-3 label-caps !text-[9px] !tracking-[0.2em] !text-cream/90 drop-shadow">
            {video.category}
          </p>
        )}

        {/* Thin-stroke play circle — always visible at reduced opacity */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full border border-cream/70 group-hover:border-champagne bg-black/20 backdrop-blur-[2px] opacity-80 group-hover:opacity-100 transition-all duration-500 ease-cinematic group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <svg
              viewBox="0 0 12 14"
              className="w-3 h-3 text-cream group-hover:text-champagne transition-colors duration-500 ease-cinematic ml-0.5"
              aria-hidden="true"
              fill="currentColor"
            >
              <polygon points="0,0 12,7 0,14" />
            </svg>
          </div>
        </div>

        {/* Title — bottom, with hover hairline reveal */}
        <div className="absolute bottom-0 inset-x-0 p-4">
          <div className="h-px w-6 bg-champagne/80 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-cinematic" />
          <p className="font-display italic text-sm text-cream/95 leading-tight drop-shadow line-clamp-2">
            {video.title.replace("Allan Palmer - ", "")}
          </p>
          {video.duration && (
            <p className="font-display text-[10px] text-cream/60 tabular-nums mt-1.5">
              {video.duration}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
