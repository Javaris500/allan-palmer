"use client"

import { motion } from "framer-motion"
import { AnimatedElement } from "@/components/animated-element"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function AboutTestimonials() {
  const testimonials = [
    {
      quote:
        "Allan has a remarkable ability to connect with students of all ages. His patience and enthusiasm made learning violin enjoyable for my daughter.",
      author: "Rebecca T.",
      relation: "Parent of Student",
    },
    {
      quote:
        "Having Allan perform at our wedding was one of the best decisions we made. His music created the perfect atmosphere for our ceremony.",
      author: "Michael & Sarah",
      relation: "Wedding Clients",
    },
    {
      quote:
        "As an adult beginner, I was nervous about taking lessons, but Allan's supportive teaching style made me feel comfortable and confident.",
      author: "James L.",
      relation: "Adult Student",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30 dark:bg-muted/10">
      <div className="container">
        <AnimatedElement variant="fade-up" className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl mb-4">What People Say</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hear from students, clients, and collaborators about their experiences working with me
          </p>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedElement key={index} variant="fade-up" delay={index * 0.1}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="mb-6 text-lg font-medium leading-relaxed">"{testimonial.quote}"</p>
                    <div className="border-t border-border pt-4">
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.relation}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedElement>
          ))}
        </div>
      </div>
    </section>
  )
}
