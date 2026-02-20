"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import type { CarouselApi } from "@/components/ui/carousel"
import { TiltCard } from "@/components/ui/tilt-card"

const defaultTestimonials = [
  {
    quote:
      "Allan played the cocktail and dinner hours at my wedding on June 21, 2025 and it was absolutely wonderful. Allan has an extensive repertoire and was able to play requests from our guests - that was a huge hit. He is charming and so very talented. Allan's playing added so much to our day, I cannot recommend him highly enough!",
    author: "Renate Rossol",
    event: "Wedding Reception",
    rating: 5,
  },
  {
    quote:
      "Allan was the most incredible addition to our wedding. He's professional and has a large range of music to choose from. This talented artist made our special day unforgettable. Should definitely consider for your event!",
    author: "Claire Robinson",
    event: "Wedding Ceremony",
    rating: 5,
  },
  {
    quote:
      "Allan Palmer (The violinist) at our wedding was truly exceptional. His playing was not only technically flawless but also deeply expressive, adding an elegant and heartfelt touch to our special day. Beyond his musical talent, he was warm, personable, and engaging—many of our guests commented on how much they enjoyed his performance.",
    author: "Dale Stanley",
    event: "Wedding Ceremony",
    rating: 5,
  },
  {
    quote:
      "My wife and I cannot say enough good things about Allan. First, he learned our favourite song for her to walk down the aisle to and played it with perfection. Second, he was timely and in constant communication to ensure the music was played to our satisfaction. Lastly, he saved our wedding during a false fire alarm in which we had to evacuate our wedding venue during dinner.",
    author: "Jeremy De Las Alas",
    event: "Wedding Ceremony",
    rating: 5,
  },
  {
    quote:
      "Allan provided a lovely musical backdrop for our ceremony. He arrived on time, was well‑prepared, and handled our song choices smoothly. The pieces were played with clear technique and appropriate volume, fitting the setting. Several guests noted how much they enjoyed the live violin.",
    author: "Parisa",
    event: "Wedding Ceremony",
    rating: 5,
  },
]

interface TestimonialsSectionProps {
  sectionTitle?: string
  sectionDescription?: string
}

export function TestimonialsSection({
  sectionTitle = "Client Reviews",
  sectionDescription = "Real reviews from Google Reviews - hear what clients have to say about their experiences with Allan.",
}: TestimonialsSectionProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [isPaused, setIsPaused] = useState(false)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const testimonials = defaultTestimonials

  // Empty state if no testimonials
  if (testimonials.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Client Testimonials Coming Soon
            </h2>
            <p className="text-muted-foreground mb-6">
              Allan has performed at hundreds of events. Check back soon for reviews from happy clients!
            </p>
            <Button asChild>
              <Link href="/contact">Book Allan for Your Event</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Track carousel state
  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Auto-scroll functionality with pause on hover
  useEffect(() => {
    if (!api || isPaused) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => clearInterval(interval)
  }, [api, isPaused])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">{sectionTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {sectionDescription}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="font-serif text-xl font-semibold mb-4">See Allan in Action</h3>
            <div className="relative overflow-hidden rounded-lg shadow-elevation-3">
              <Image
                src="/wedding-with-couple.jpg"
                alt="Allan Palmer performing at a wedding with the bride and groom"
                width={800}
                height={533}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>

        <div 
        className="mx-auto mt-12 max-w-6xl relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons */}
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background/80 backdrop-blur-sm shadow-elevation-2 hover:shadow-elevation-3"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background/80 backdrop-blur-sm shadow-elevation-2 hover:shadow-elevation-3"
            onClick={scrollNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <TiltCard tiltAmount={8} glareEnabled={true} scale={1.02}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-elevation-3 dark:hover:shadow-primary/5 h-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <CardContent className="pt-6 pb-4">
                      <div className="transition-colors duration-300 group-hover:text-primary/50">
                        <Quote className="h-10 w-10 text-primary/30" />
                      </div>
                      <p className="mt-4 text-base leading-relaxed">{testimonial.quote}</p>
                      <div className="flex mt-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start border-t border-border/50 pt-4">
                      <p className="font-serif font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Google Reviews</p>
                    </CardFooter>
                  </Card>
                </TiltCard>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current 
                  ? "bg-primary w-6" 
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
