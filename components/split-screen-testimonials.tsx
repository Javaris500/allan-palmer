"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const defaultTestimonials = [
  {
    quote: "Allan played the cocktail and dinner hours at my wedding on June 21, 2025 and it was absolutely wonderful. Allan has an extensive repertoire and was able to play requests from our guests - that was a huge hit.",
    author: "Renate Rossol",
    event: "Wedding Reception",
    rating: 5,
    image: "/images/allan-1.jpeg"
  },
  {
    quote: "Allan was the most incredible addition to our wedding. He's professional and has a large range of music to choose from. This talented artist made our special day unforgettable.",
    author: "Claire Robinson",
    event: "Wedding Ceremony",
    rating: 5,
    image: "/images/allan2.jpeg"
  },
  {
    quote: "Allan Palmer at our wedding was truly exceptional. His playing was not only technically flawless but also deeply expressive, adding an elegant and heartfelt touch to our special day.",
    author: "Dale Stanley",
    event: "Wedding Ceremony",
    rating: 5,
    image: "/images/allan3.jpeg"
  },
  {
    quote: "My wife and I cannot say enough good things about Allan. He learned our favourite song and played it with perfection. Timely communication and saved our wedding during a false fire alarm.",
    author: "Jeremy De Las Alas",
    event: "Wedding Ceremony",
    rating: 5,
    image: "/images/allan-indoor-event.jpeg"
  },
  {
    quote: "Allan provided a lovely musical backdrop for our ceremony. Well-prepared, smooth execution, and several guests noted how much they enjoyed the live violin.",
    author: "Parisa",
    event: "Wedding Ceremony",
    rating: 5,
    image: "/images/allan-social-event.jpeg"
  },
]

const images = ["/images/allan-1.jpeg", "/images/allan2.jpeg", "/images/allan3.jpeg", "/images/allan-indoor-event.jpeg", "/images/allan-social-event.jpeg"]

export function SplitScreenTestimonials() {
  const testimonials = defaultTestimonials
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [isPaused, next])

  const currentTestimonial = testimonials[currentIndex]
  if (!currentTestimonial) return null

  return (
    <section
      className="relative min-h-[600px] md:min-h-[700px] bg-background dark:bg-black overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={currentTestimonial.image}
            alt="Wedding testimonial background"
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 dark:from-black/98 dark:via-black/95 dark:to-black/85" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Quote */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <Quote className="h-16 w-16 text-gold/30" />

                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium leading-relaxed text-white">
                  "{currentTestimonial.quote}"
                </blockquote>

                <div className="space-y-3">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Author */}
                  <div>
                    <p className="text-xl font-bold text-gold">{currentTestimonial.author}</p>
                    <p className="text-sm text-gray-400">{currentTestimonial.event}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right: Navigation & Indicators */}
            <div className="flex flex-col items-end justify-center gap-8">
              {/* Slide indicators */}
              <div className="flex flex-col gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1 transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "h-16 bg-gold"
                        : "h-8 bg-gold/30 hover:bg-gold/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previous}
                  className="h-12 w-12 rounded-full border-2 border-gold/30 bg-black/50 hover:bg-gold hover:border-gold backdrop-blur-sm"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  className="h-12 w-12 rounded-full border-2 border-gold/30 bg-black/50 hover:bg-gold hover:border-gold backdrop-blur-sm"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold/20">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-gold"
          />
        </div>
      )}
    </section>
  )
}
