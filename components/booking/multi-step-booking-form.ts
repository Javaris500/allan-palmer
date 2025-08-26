"use client"

export interface BookingData {
  service?: string
  serviceType?: string
  date?: Date
  timeSlot?: string
  location?: string
  name?: string
  email?: string
  phone?: string
  message?: string
  numberOfAttendees?: number
  specialRequests?: string
}

export const initialBookingData: BookingData = {
  service: undefined,
  serviceType: undefined,
  date: undefined,
  timeSlot: undefined,
  location: undefined,
  name: undefined,
  email: undefined,
  phone: undefined,
  message: undefined,
  numberOfAttendees: undefined,
  specialRequests: undefined
}
