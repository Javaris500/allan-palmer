"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, Minus, Music, Heart, GraduationCap, Sparkles, Users, Calendar, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceCategory {
  id: string
  name: string
  shortName: string
  icon: React.ElementType
  description: string
  color: string
}

interface Feature {
  id: string
  name: string
  category: string
  availability: {
    weddings: boolean | "optional"
    private: boolean | "optional"
    lessons: boolean | "optional"
  }
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "weddings",
    name: "Wedding Services",
    shortName: "Weddings",
    icon: Music,
    description: "Elegant violin music for your special day",
    color: "bg-gold/10 text-gold",
  },
  {
    id: "private",
    name: "Private & Corporate",
    shortName: "Private/Corp",
    icon: Heart,
    description: "Personalized performances for any occasion",
    color: "bg-gold/15 text-gold",
  },
  {
    id: "lessons",
    name: "Violin Lessons",
    shortName: "Lessons",
    icon: GraduationCap,
    description: "Professional instruction for all levels",
    color: "bg-gold/10 text-gold",
  },
]

const features: Feature[] = [
  // Event Types - Weddings
  { id: "ceremony", name: "Ceremony Music", category: "Event Types", availability: { weddings: true, private: false, lessons: false } },
  { id: "processional", name: "Processional & Recessional", category: "Event Types", availability: { weddings: true, private: false, lessons: false } },
  { id: "cocktail", name: "Cocktail Hour", category: "Event Types", availability: { weddings: true, private: true, lessons: false } },
  { id: "reception", name: "Reception Entertainment", category: "Event Types", availability: { weddings: true, private: true, lessons: false } },
  { id: "first-dance", name: "First Dance Music", category: "Event Types", availability: { weddings: true, private: false, lessons: false } },
  { id: "bridal-shower", name: "Bridal Showers", category: "Event Types", availability: { weddings: true, private: false, lessons: false } },
  { id: "bachelorette", name: "Bachelorette Parties", category: "Event Types", availability: { weddings: true, private: false, lessons: false } },
  
  // Event Types - Private/Corporate
  { id: "dinner-party", name: "Dinner Parties", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "birthday", name: "Birthday Celebrations", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "anniversary", name: "Anniversaries", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "proposal", name: "Proposals", category: "Event Types", availability: { weddings: true, private: true, lessons: false } },
  { id: "memorial", name: "Celebrations of Life & Memorials", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "baby-shower", name: "Baby Showers", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "corporate", name: "Corporate Events & Galas", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "product-launch", name: "Product Launches", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "holiday", name: "Holiday Parties", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  { id: "nursing-home", name: "Nursing Home Performances", category: "Event Types", availability: { weddings: false, private: true, lessons: false } },
  
  // Performance Features
  { id: "custom-arrangements", name: "Custom Song Arrangements", category: "Performance Features", availability: { weddings: true, private: true, lessons: false } },
  { id: "amplification", name: "Amplification Available", category: "Performance Features", availability: { weddings: true, private: true, lessons: false } },
  { id: "multi-location", name: "Multiple Location Setup", category: "Performance Features", availability: { weddings: true, private: "optional", lessons: false } },
  { id: "classical", name: "Classical Repertoire", category: "Performance Features", availability: { weddings: true, private: true, lessons: true } },
  { id: "contemporary", name: "Contemporary & Pop", category: "Performance Features", availability: { weddings: true, private: true, lessons: true } },
  
  // Lesson Features
  { id: "beginner", name: "Beginner Instruction", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "advanced", name: "Advanced Instruction", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "online", name: "Online Sessions Available", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "in-person", name: "In-Person Sessions", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "curriculum", name: "Personalized Curriculum", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "practice-plans", name: "Structured Practice Plans", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "digital-materials", name: "Digital Learning Materials", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
  { id: "performance-opps", name: "Performance Opportunities", category: "Lesson Features", availability: { weddings: false, private: false, lessons: true } },
]

// Group features by category
const featuresByCategory = features.reduce((acc, feature) => {
  if (!acc[feature.category]) {
    acc[feature.category] = []
  }
  acc[feature.category]!.push(feature)
  return acc
}, {} as Record<string, Feature[]>)

function AvailabilityIcon({ available }: { available: boolean | "optional" }) {
  if (available === true) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-gold" />
        </div>
      </div>
    )
  }
  if (available === "optional") {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-gold/50" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center">
        <Minus className="w-3 h-3 text-muted-foreground/30" />
      </div>
    </div>
  )
}

function ServiceHeader({ category, index }: { category: ServiceCategory; index: number }) {
  const Icon = category.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col items-center text-center p-4"
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", category.color)}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif font-bold text-sm md:text-base text-foreground">
        <span className="hidden md:inline">{category.name}</span>
        <span className="md:hidden">{category.shortName}</span>
      </h3>
      <p className="text-xs text-muted-foreground mt-1 hidden lg:block max-w-[140px]">
        {category.description}
      </p>
    </motion.div>
  )
}

export function ServicesComparisonChart() {
  return (
    <section className="py-16 md:py-24 bg-background dark:bg-black">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-gold mb-4"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Service Comparison</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-tight"
          >
            Find Your <span className="text-gold">Perfect Service</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Compare all available services to find the perfect fit for your occasion
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-card/50 backdrop-blur-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-gold/20 bg-muted/30 sticky top-0 z-10">
              <div className="p-4 flex items-center">
                <span className="font-semibold text-sm text-foreground">Features</span>
              </div>
              {serviceCategories.map((category, index) => (
                <ServiceHeader key={category.id} category={category} index={index} />
              ))}
            </div>

            {/* Table Body - grouped by category */}
            <div className="divide-y divide-gold/10">
              {Object.entries(featuresByCategory).map(([categoryName, categoryFeatures], categoryIndex) => (
                <div key={categoryName}>
                  {/* Category Header Row */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                    className="grid grid-cols-4 bg-gold/5"
                  >
                    <div className="col-span-4 px-4 py-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gold">
                        {categoryName}
                      </span>
                    </div>
                  </motion.div>

                  {/* Feature Rows */}
                  {categoryFeatures.map((feature, featureIndex) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + categoryIndex * 0.1 + featureIndex * 0.02 }}
                      className="grid grid-cols-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="p-4 flex items-center">
                        <span className="text-sm text-foreground/80">{feature.name}</span>
                      </div>
                      <div className="p-4">
                        <AvailabilityIcon available={feature.availability.weddings} />
                      </div>
                      <div className="p-4">
                        <AvailabilityIcon available={feature.availability.private} />
                      </div>
                      <div className="p-4">
                        <AvailabilityIcon available={feature.availability.lessons} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-gold" />
            </div>
            <span>Included</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-gold/50" />
            </div>
            <span>Available (on request)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center">
              <Minus className="w-3 h-3 text-muted-foreground/30" />
            </div>
            <span>Not applicable</span>
          </div>
        </motion.div>

        {/* Highlight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Users,
              title: "Personalized Service",
              description: "Every event receives dedicated attention and custom arrangements tailored to your vision.",
            },
            {
              icon: Calendar,
              title: "Flexible Scheduling",
              description: "Available for events year-round with accommodating booking options.",
            },
            {
              icon: MapPin,
              title: "Winnipeg & Beyond",
              description: "Serving Winnipeg, Manitoba and surrounding areas for all types of events.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="relative p-6 rounded-xl border border-gold/20 bg-card/30 hover:bg-card/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <item.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Every occasion is unique. Contact Allan to discuss your specific needs and receive a personalized consultation.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
