"use client"

import type React from "react"
import Link from "next/link"

import { Music, GraduationCap, Heart } from "lucide-react"
import { AnimatedElement } from "@/components/animated-element"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState("weddings")

  const services = {
    weddings: {
      title: "Wedding Services",
      description: "Create unforgettable moments with elegant violin music for your special day.",
      icon: Music,
      items: [
        "Pre-Ceremony Music",
        "Ceremony Music",
        "Processional & Recessional",
        "First Dance Music",
        "Cocktail Hour",
        "Reception Entertainment",
        "Bachelorette Parties",
        "Bridal Showers",
        "Custom Song Arrangements",
        "Amplification Available",
        "Multiple Location Setup",
      ],
    },
    private: {
      title: "Private Functions",
      description: "Personalized violin performances for your intimate gatherings and special occasions.",
      icon: Heart,
      items: [
        "Dinner Parties",
        "Birthday Parties",
        "Anniversaries",
        "Proposals",
        "Celebrations of Life",
        "Funerals",
        "Baby Showers",
        "Nursing Homes",
        "Family Gatherings",
        "Holiday Celebrations",
        "Memorial Services",
        "Corporate Events",
        "Galas & Fundraisers",
        "Product Launches",
        "Holiday Parties",
        "Client Appreciation Events",
      ],
    },
    lessons: {
      title: "Violin Lessons",
      description: "Learn violin from a professional with personalized instruction for all skill levels.",
      icon: GraduationCap,
      items: [
        "Beginner to Advanced",
        "Classical & Contemporary",
        "Online & In-Person",
        "Personalized Curriculum",
        "Structured Practice Plans",
        "Digital Learning Materials",
        "Performance Opportunities",
      ],
    },
  }

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <section className="container py-16 md:py-24">
      <AnimatedElement variant="fade-up" className="text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">Services Offered</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Elevate your event with beautiful violin music or enhance your skills with professional lessons.
        </p>
      </AnimatedElement>

      <div className="mt-12">
        <Tabs defaultValue="weddings" value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-lg border">
            <TabsList className="flex w-full justify-between bg-background">
              <TabsTrigger
                value="weddings"
                className="flex-1 flex items-center justify-center gap-2 px-2 py-3 data-[state=active]:bg-muted/50 sm:px-4"
              >
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate={activeTab === "weddings" ? "visible" : "hidden"}
                  className="hidden h-6 w-6 items-center justify-center rounded-full bg-primary/10 sm:flex"
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    <Music className="h-4 w-4 text-primary" />
                  </div>
                </motion.div>
                <span className="text-sm sm:text-base">Weddings</span>
              </TabsTrigger>

              <TabsTrigger
                value="private"
                className="flex-1 flex items-center justify-center gap-2 px-2 py-3 data-[state=active]:bg-muted/50 sm:px-4"
              >
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate={activeTab === "private" ? "visible" : "hidden"}
                  className="hidden h-6 w-6 items-center justify-center rounded-full bg-primary/10 sm:flex"
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                </motion.div>
                <span className="text-sm sm:text-base">Private Events</span>
              </TabsTrigger>

              <TabsTrigger
                value="lessons"
                className="flex-1 flex items-center justify-center gap-2 px-2 py-3 data-[state=active]:bg-muted/50 sm:px-4"
              >
                <motion.div
                  variants={iconVariants}
                  initial="hidden"
                  animate={activeTab === "lessons" ? "visible" : "hidden"}
                  className="hidden h-6 w-6 items-center justify-center rounded-full bg-primary/10 sm:flex"
                >
                  <div className="flex h-4 w-4 items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                </motion.div>
                <span className="text-sm sm:text-base">Lessons</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="weddings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ServiceDetail service={services.weddings} />
            </TabsContent>

            <TabsContent value="private" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ServiceDetail service={services.private} />
            </TabsContent>

            <TabsContent value="lessons" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <ServiceDetail service={services.lessons} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-lg bg-muted/50 p-4 sm:p-6 dark:bg-muted/20">
        <h3 className="text-center text-lg font-medium">Need more information?</h3>
        <p className="mt-2 text-center text-sm sm:text-base text-muted-foreground">
          Contact Allan directly to discuss your specific requirements or to request a custom quote.
        </p>
        <div className="mt-4 flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Link
              href="/services"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Book Allan Palmer
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

interface ServiceDetailProps {
  service: {
    title: string
    description: string
    icon: React.ElementType
    items: string[]
  }
}

function ServiceDetail({ service }: ServiceDetailProps) {
  const Icon = service.icon

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-serif text-2xl font-semibold">{service.title}</h3>
        </div>
        <p className="mt-4 text-muted-foreground">{service.description}</p>
      </div>
      <div>
        <h4 className="mb-4 font-medium">What's Included:</h4>
        <ul className="space-y-2">
          {service.items.map((item, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex h-5 w-5 items-center justify-center shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}
