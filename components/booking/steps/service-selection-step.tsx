"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, GraduationCap, Heart, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { BookingData } from "../multi-step-booking-form"

interface ServiceSelectionStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  canGoBack: boolean
}

const services = [
  {
    id: "weddings",
    title: "Wedding Services",
    description: "Beautiful violin music for your special day",
    icon: Music,
    popular: true,
    types: [
      {
        id: "ceremony",
        title: "Ceremony Only",
        duration: "1 hour",
        description: "Perfect for intimate ceremonies",
      },
      {
        id: "ceremony-cocktail",
        title: "Ceremony + Cocktail Hour",
        duration: "2.5 hours",
        description: "Complete ceremony and reception music",
      },
      {
        id: "full-wedding",
        title: "Full Wedding Package",
        duration: "5+ hours",
        description: "Complete musical experience for your day",
      },
    ],
  },
  {
    id: "private",
    title: "Private Functions",
    description: "Personalized music for intimate occasions",
    icon: Heart,
    types: [
      {
        id: "dinner-party",
        title: "Dinner Party",
        duration: "2 hours",
        description: "Elegant background music for dining",
      },
      {
        id: "celebration",
        title: "Special Celebration",
        duration: "3 hours",
        description: "Birthdays, anniversaries, and milestones",
      },
      {
        id: "memorial",
        title: "Memorial Service",
        duration: "1.5 hours",
        description: "Respectful music for remembrance",
      },
      {
        id: "corporate",
        title: "Corporate Event",
        duration: "2-4 hours",
        description: "Professional events and business functions",
      },
    ],
  },
  {
    id: "lessons",
    title: "Violin Lessons",
    description: "Professional instruction for all skill levels",
    icon: GraduationCap,
    types: [
      {
        id: "single",
        title: "Single Lesson",
        duration: "60 minutes",
        description: "One-time lesson or trial",
      },
      {
        id: "monthly",
        title: "Monthly Package",
        duration: "4 lessons",
        description: "Weekly lessons for consistent progress",
      },
      {
        id: "intensive",
        title: "Intensive Program",
        duration: "12 weeks",
        description: "Comprehensive skill development",
      },
    ],
  },
]

export function ServiceSelectionStep({ bookingData, updateBookingData, onNext }: ServiceSelectionStepProps) {
  const [selectedService, setSelectedService] = useState(bookingData.service)
  const [selectedType, setSelectedType] = useState(bookingData.serviceType)

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setSelectedType("") // Reset type when service changes
  }

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleContinue = () => {
    updateBookingData({
      service: selectedService,
      serviceType: selectedType,
    })
    onNext()
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)
  const isValid = selectedService && selectedType

  return (
    <div className="space-y-8">
      {/* Service Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Choose Your Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            const isSelected = selectedService === service.id

            return (
              <motion.div key={service.id} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md relative",
                    isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50",
                  )}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  {service.popular && <Badge className="absolute -top-2 -right-2 bg-primary">Most Popular</Badge>}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          isSelected ? "bg-primary/20" : "bg-muted",
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Package Type Selection */}
      {selectedServiceData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h3 className="text-xl font-semibold mb-4">Select Package Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedServiceData.types.map((type) => {
              const isSelected = selectedType === type.id

              return (
                <Card
                  key={type.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50",
                  )}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{type.title}</h4>
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2",
                            isSelected ? "border-primary bg-primary" : "border-muted-foreground",
                          )}
                        >
                          {isSelected && <div className="w-full h-full rounded-full bg-white scale-50" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      <div className="text-sm text-muted-foreground">{type.duration}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!isValid} size="lg" className="min-w-32">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
