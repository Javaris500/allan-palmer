"use client"

import { ContactForm } from "@/components/contact/contact-form"
import { motion } from "framer-motion"

export function ContactFormSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gold/5 rounded-3xl blur-3xl -z-10" />

      {/* Form container with subtle border, no card background */}
      <div className="bg-transparent border-2 border-gold/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-gold/10">
        <ContactForm />
      </div>
    </motion.div>
  )
}
