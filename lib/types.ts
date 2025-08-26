import type React from "react"
// Global type definitions
export interface NavItem {
  href: string
  label: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

export interface Song {
  id: string
  title: string
  artist: string
  genre: string
  category: string
  duration: string
  description: string
}

export interface Testimonial {
  quote: string
  author: string
  event: string
  rating: number
}

export interface VideoData {
  playbackId: string
  title?: string
  description?: string
}

export interface ServiceType {
  id: string
  title: string
  duration: string
  description: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  popular?: boolean
  types: ServiceType[]
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface BookingFormData {
  service: string
  serviceType: string
  date: Date | null
  time: string
  duration: string
  location: string
  guests: string
  specialRequests: string
  name: string
  email: string
  phone: string
  musicPreferences: string
  setupRequirements: string
}
