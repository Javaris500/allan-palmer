"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { AnimatedElement } from "@/components/animated-element"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

export function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>()

  const testimonials = [
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

  // Auto-scroll functionality
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 4000) // Move every 4 seconds for slow speed

    return () => clearInterval(interval)
  }, [api])

  return (
    <section className="container py-16 md:py-24">
      <AnimatedElement variant="slide-up">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Client Reviews</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Real reviews from Google Reviews - hear what clients have to say about their experiences with Allan.
          </p>
        </div>
      </AnimatedElement>

      <div className="mx-auto mt-12 max-w-4xl">
        <AnimatedElement variant="slide-up" delay={0.2}>
          <div className="text-center mb-8">
            <h3 className="font-serif text-xl font-semibold mb-4">See Allan in Action</h3>
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src="/wedding-with-couple.jpg"
                alt="Allan Palmer performing at a wedding with the bride and groom"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </AnimatedElement>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
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
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 h-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <CardContent className="pt-6 pb-4">
                      <motion.div
                        initial={{ rotate: -5, opacity: 0.3 }}
                        whileInView={{ rotate: 0, opacity: 0.3 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="transition-colors duration-300 group-hover:text-primary/50"
                      >
                        <Quote className="h-10 w-10 text-primary/30" />
                      </motion.div>
                      <p className="mt-4 text-base leading-relaxed">{testimonial.quote}</p>
                      <div className="flex mt-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
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
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
