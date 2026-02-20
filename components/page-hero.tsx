"use client"

import { motion } from "framer-motion"
import { AnimatedGradientMesh } from "@/components/ui/animated-gradient-mesh"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeroProps {
  badge?: string
  title: string
  titleHighlight?: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  variant?: "gold" | "purple" | "blue" | "warm"
  intensity?: "subtle" | "medium" | "vibrant"
  size?: "sm" | "md" | "lg"
}

export function PageHero({
  badge,
  title,
  titleHighlight,
  description,
  breadcrumbs,
  variant = "gold",
  intensity = "medium",
  size = "md",
}: PageHeroProps) {
  const sizeClasses = {
    sm: "py-16 md:py-20",
    md: "py-20 md:py-28",
    lg: "py-24 md:py-36",
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  return (
    <section className={`relative overflow-hidden ${sizeClasses[size]}`}>
      {/* Animated Gradient Mesh Background */}
      <AnimatedGradientMesh variant={variant} intensity={intensity} />

      {/* Content */}
      <div className="container relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              variants={itemVariants}
              className="flex items-center justify-center gap-2 text-sm text-white/50 mb-6"
            >
              <Link href="/" className="hover:text-white/80 transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-white/80 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/70">{crumb.label}</span>
                  )}
                </span>
              ))}
            </motion.nav>
          )}

          {/* Badge */}
          {badge && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 text-sm font-medium border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                </span>
                <span className="text-gold">{badge}</span>
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white"
          >
            {title}{" "}
            {titleHighlight && (
              <span className="text-gold">{titleHighlight}</span>
            )}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  )
}
