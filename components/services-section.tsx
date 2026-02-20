"use client"

import { motion } from "framer-motion"
import { Music, Heart, GraduationCap, Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceTier {
  name: string
  description: string
  icon: React.ElementType
  featured?: boolean
  includes: string[]
}

const serviceTiers: ServiceTier[] = [
  {
    name: "Wedding Services",
    description: "Elegant violin music for every moment of your special day",
    icon: Music,
    featured: true,
    includes: [
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
  {
    name: "Private & Corporate",
    description: "Personalized performances for gatherings of all kinds",
    icon: Heart,
    includes: [
      "Dinner Parties",
      "Birthday Parties",
      "Anniversaries",
      "Proposals",
      "Celebrations of Life",
      "Funerals & Memorials",
      "Baby Showers",
      "Nursing Homes",
      "Corporate Events",
      "Galas & Fundraisers",
      "Product Launches",
      "Holiday Parties",
      "Client Appreciation Events",
    ],
  },
  {
    name: "Violin Lessons",
    description: "Professional instruction tailored to your skill level",
    icon: GraduationCap,
    includes: [
      "Beginner to Advanced",
      "Classical & Contemporary",
      "Online & In-Person",
      "Personalized Curriculum",
      "Structured Practice Plans",
      "Digital Learning Materials",
      "Performance Opportunities",
    ],
  },
]

function ServiceCard({ tier, index }: { tier: ServiceTier; index: number }) {
  const Icon = tier.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        "relative flex flex-col rounded-2xl border-2 p-6 md:p-8 transition-all duration-300",
        tier.featured
          ? "border-gold bg-gold/5 shadow-xl shadow-gold/10"
          : "border-gold/20 bg-transparent hover:border-gold/40"
      )}
    >
      {/* Featured badge */}
      {tier.featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-gold text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Star className="h-3 w-3 fill-black" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <div className={cn(
          "inline-flex items-center justify-center w-14 h-14 rounded-full mb-4",
          tier.featured ? "bg-gold/20" : "bg-gold/10"
        )}>
          <Icon className={cn("h-7 w-7", tier.featured ? "text-gold" : "text-gold/80")} />
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">
          {tier.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {tier.description}
        </p>
      </div>

      {/* Divider */}
      <div className={cn(
        "h-px w-full mb-6",
        tier.featured ? "bg-gold/30" : "bg-gold/10"
      )} />

      {/* Includes list */}
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
          What's Included
        </p>
        <ul className="space-y-3">
          {tier.includes.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.03 }}
              className="flex items-start gap-3"
            >
              <div className={cn(
                "flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full",
                tier.featured ? "bg-gold/20" : "bg-gold/10"
              )}>
                <Check className={cn(
                  "h-3 w-3",
                  tier.featured ? "text-gold" : "text-gold/70"
                )} />
              </div>
              <span className="text-sm text-foreground/80">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-background dark:bg-black">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            Services <span className="text-gold">Offered</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From intimate ceremonies to grand celebrations, Allan brings artistry and professionalism to every occasion.
          </p>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {serviceTiers.map((tier, index) => (
            <ServiceCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Every event is unique. Contact Allan to discuss your specific needs and receive a personalized quote.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
