"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Volume2, VolumeX } from "lucide-react";
import { MUX_CONFIG } from "@/lib/constants";
import { EASE_OUT } from "@/lib/motion";

// ═══════════════════════════════════════════════════════
// Cinematic full-bleed hero — film-opening vocabulary
// Allan Palmer as the title card, everything else quiet.
// ═══════════════════════════════════════════════════════

const stats = [
  { value: "18+", label: "Years with violin" },
  { value: "200+", label: "Engagements" },
  { value: "148", label: "Selected works" },
];

export function HomeHero() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<unknown>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const hlsUrl = MUX_CONFIG.getHlsUrl();
  // Landscape 16:9 poster — used as the cinematic still before video loads
  // and as the permanent fallback on devices where autoplay is blocked.
  const posterUrl = `https://image.mux.com/${MUX_CONFIG.playbackId}/thumbnail.png?width=1920&height=1080&fit_mode=smartcrop&time=8`;

  const initVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        video.muted = true;
        video.loop = true;
        await video.play();
        setVideoReady(true);
        return;
      }

      const Hls = (await import("hls.js")).default;
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          capLevelToPlayerSize: true,
          startLevel: 3,
          maxBufferLength: 30,
        });
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
          video.muted = true;
          video.loop = true;
          try {
            await video.play();
            setVideoReady(true);
          } catch {
            // Autoplay blocked — poster stays.
          }
        });
        hlsRef.current = hls;
      }
    } catch {
      // Silent fallback to poster.
    }
  }, [hlsUrl]);

  useEffect(() => {
    initVideo();
    return () => {
      const hls = hlsRef.current as { destroy?: () => void } | null;
      hls?.destroy?.();
    };
  }, [initVideo]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[hsl(var(--bg))]">
      {/* ═══════════ Background video + poster ═══════════ */}
      <div className="absolute inset-0">
        <Image
          src={posterUrl}
          alt="Allan Palmer performing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <video
          ref={videoRef}
          muted={isMuted}
          playsInline
          loop
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1500ms] ease-cinematic ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Cinematic gradient stack — dark vignette at edges, breathable center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/90"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_85%)]"
      />

      {/* ═══════════ F-hole signature motif — bottom-right watermark ═══════════ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 opacity-[0.05] hidden md:block select-none"
      >
        <Image
          src="/images/f-hole.svg"
          alt=""
          width={260}
          height={720}
          className="text-champagne"
        />
      </div>

      {/* ═══════════ Audio toggle — top right, small ═══════════ */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={
          isMuted ? "Unmute background video" : "Mute background video"
        }
        className="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-10 h-10 rounded-full border border-cream/30 bg-black/25 backdrop-blur-sm flex items-center justify-center text-cream/80 hover:text-champagne hover:border-champagne transition-colors duration-500 ease-cinematic focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <Volume2 className="w-4 h-4" strokeWidth={1.5} />
        )}
      </button>

      {/* ═══════════ Foreground content ═══════════ */}
      <div className="relative z-10 min-h-[100svh] flex flex-col justify-between pt-24 pb-10 md:pt-28 md:pb-12 px-6">
        {/* Spacer to breathe above the name */}
        <div aria-hidden="true" />

        {/* Center title block */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8 md:mb-10"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }
            }
          >
            <div className="h-px w-10 md:w-16 bg-champagne/70" />
            <span className="label-caps !text-[10px] md:!text-xs !tracking-[0.4em] !text-champagne">
              The Violinist
            </span>
            <div className="h-px w-10 md:w-16 bg-champagne/70" />
          </motion.div>

          {/* Display name */}
          <motion.h1
            className="font-display font-light text-[clamp(3.5rem,10vw,8rem)] tracking-[-0.02em] leading-[0.92] text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.1, ease: EASE_OUT, delay: 0.1 }
            }
          >
            Allan Palmer
          </motion.h1>

          {/* Italic manifesto subtitle */}
          <motion.p
            className="mt-6 md:mt-8 font-display italic font-light text-base md:text-xl lg:text-2xl text-cream/85 leading-relaxed max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1, ease: EASE_OUT, delay: 0.3 }
            }
          >
            A violin for weddings, ceremonies, and the occasions that matter.
          </motion.p>

          {/* Hairline rule */}
          <motion.div
            className="h-px w-16 bg-champagne/60 my-9 md:my-11"
            initial={reduced ? { opacity: 1 } : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.5 }
            }
          />

          {/* CTAs — single hero of weight, secondary as text link */}
          <motion.div
            className="flex items-center gap-8"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.9, ease: EASE_OUT, delay: 0.6 }
            }
          >
            <Link
              href="/booking"
              className="inline-block bg-gold hover:bg-champagne text-ink px-9 py-4 rounded-sm text-[11px] md:text-xs tracking-[0.24em] uppercase font-label transition-colors duration-500 ease-cinematic"
            >
              Book Allan
            </Link>
            <Link
              href="/services"
              className="text-link !text-[11px] md:!text-xs !tracking-[0.24em] text-cream/75 hover:text-champagne"
            >
              View Services
            </Link>
          </motion.div>
        </div>

        {/* Bottom strip: stats + scroll cue */}
        <motion.div
          className="relative max-w-4xl mx-auto w-full"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1, ease: EASE_OUT, delay: 0.9 }
          }
        >
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-10 text-center mb-6 md:mb-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-light text-2xl md:text-4xl text-champagne leading-none tabular-nums drop-shadow">
                  {s.value}
                </div>
                <div className="label-caps !text-[9px] md:!text-[10px] !tracking-[0.3em] !text-cream/60 mt-2 md:mt-3 leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight - 80,
                behavior: "smooth",
              })
            }
            className="flex flex-col items-center gap-2 mx-auto text-cream/50 hover:text-champagne transition-colors duration-500 ease-cinematic group"
            aria-label="Scroll to next section"
          >
            <span className="label-caps !text-[9px] !tracking-[0.45em] !text-cream/55 group-hover:!text-champagne transition-colors">
              Scroll
            </span>
            <motion.div
              animate={reduced ? {} : { y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
