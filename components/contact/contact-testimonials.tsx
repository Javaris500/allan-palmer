"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    quote: "Allan played the cocktail and dinner hours at my wedding and it was absolutely wonderful. He is charming and so very talented.",
    author: "Renate Rossol",
    event: "Wedding Reception",
    rating: 5,
  },
  {
    quote: "Allan was the most incredible addition to our wedding. This talented artist made our special day unforgettable.",
    author: "Claire Robinson",
    event: "Wedding Ceremony",
    rating: 5,
  },
  {
    quote: "Truly exceptional. His playing was not only technically flawless but also deeply expressive, adding an elegant and heartfelt touch.",
    author: "Dale Stanley",
    event: "Wedding Ceremony",
    rating: 5,
  },
]

export function ContactTestimonials() {
  return (
    <section className="py-16 bg-background dark:bg-black">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            What Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real reviews from Google Reviews
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => {
            // Create staggered heights for masonry effect
            const heightClass = index === 0 ? "lg:row-span-2" : index === 2 ? "lg:row-span-2" : ""

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={heightClass}
              >
                <div className="relative h-full bg-background dark:bg-black border-2 border-gold/20 rounded-xl p-6 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all group flex flex-col">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-gold/30 group-hover:text-gold/50 transition-colors" />
                  </div>

                  {/* Review text - flex-grow to push rating/author to bottom */}
                  <p className="text-sm text-foreground/80 dark:text-foreground/90 leading-relaxed mb-4 flex-grow">
                    "{testimonial.quote}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="border-t border-gold/10 pt-3">
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.event}</p>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
