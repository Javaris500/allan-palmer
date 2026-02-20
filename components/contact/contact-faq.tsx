"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { HelpCircle, Search } from "lucide-react"

const faqs = [
  {
    question: "How far in advance should I book?",
    answer: "For weddings and major events, I recommend booking 6-12 months in advance to secure your preferred date. However, I often accommodate last-minute bookings depending on availability. Contact me as soon as possible to check my calendar."
  },
  {
    question: "What's included in your wedding packages?",
    answer: "Wedding packages typically include ceremony music (prelude, processional, recessional), cocktail hour entertainment, and consultation to select your perfect songs. I provide professional audio equipment and can accommodate special song requests with advance notice."
  },
  {
    question: "Do you travel for events?",
    answer: "Yes! I'm based in Winnipeg, Manitoba, but regularly travel throughout the province for events. For destinations outside Manitoba, travel fees may apply. Contact me to discuss your specific location."
  },
  {
    question: "Can you learn new songs for my event?",
    answer: "Absolutely! I love learning new pieces for special occasions. With adequate notice (typically 4-6 weeks), I can prepare custom arrangements of your favorite songs. Share your song list during our consultation."
  },
  {
    question: "What's your cancellation policy?",
    answer: "I understand that plans can change. Cancellations made 90+ days before the event receive a full refund minus the deposit. For cancellations within 90 days, I'll work with you to find a suitable solution. Full policy details are provided in the booking agreement."
  },
  {
    question: "Do you offer violin lessons online?",
    answer: "Yes! I offer both in-person lessons in Winnipeg and online lessons via video call. Online lessons are a great option for students outside the area or those with scheduling constraints. All skill levels welcome."
  },
  {
    question: "What equipment do you provide?",
    answer: "For most events, I bring my professional violin, amplification system (when needed), and all necessary cables and stands. For outdoor or large venues, I can coordinate with your sound technician to ensure optimal audio quality."
  },
  {
    question: "How long does it take to get a response?",
    answer: "I typically respond to all inquiries within 24 hours, often much sooner. During peak wedding season (May-October), responses may take up to 48 hours. If you need urgent assistance, feel free to call directly."
  },
]

export function ContactFAQ() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="py-16 md:py-24 bg-background dark:bg-black">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold rounded-full px-4 py-2 text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>Common Questions</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about booking, pricing, and working with Allan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Search filter */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background dark:bg-black border-2 border-gold/20 focus:border-gold transition-colors"
            />
          </div>

          <div className="bg-background dark:bg-black border-2 border-gold/20 rounded-2xl p-6 md:p-8 shadow-lg shadow-gold/5">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-gold/20">
                    <AccordionTrigger className="text-left hover:text-gold transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No FAQs found matching "{searchQuery}"
                </p>
              )}
            </Accordion>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <a href={`mailto:${require("@/lib/constants").CONTACT_INFO.email}`} className="text-gold hover:underline">
              Send me a message
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
