"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Music, Star } from "lucide-react"
import Link from "next/link"
import { memo } from "react"

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-background-outdoor.jpeg"
          alt="Allan Palmer performing violin outdoors"
          className="w-full h-full object-cover object-[center_20%] md:object-[center_30%] lg:object-[center_25%] xl:object-[center_20%]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-white/20">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            Professional Violinist
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 leading-tight">
          <span className="block">Allan Palmer</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white/90 mt-2">
            Classical Violinist
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 font-light">
          Bringing elegance and sophistication to your most cherished moments with beautiful classical violin
          performances
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Link href="/services" className="inline-flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Book Performance
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
          >
            <Link href="/gallery" className="inline-flex items-center gap-2">
              <Music className="h-5 w-5" />
              View Performances
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
})

export { HeroSection }
