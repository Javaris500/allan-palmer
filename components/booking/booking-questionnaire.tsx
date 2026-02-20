"use client"

import { TypewriterQuestionnaire } from "@/components/ui/typewriter-questionnaire"

const bookingQuestions = [
  {
    id: "eventType",
    text: "What type of event are you planning?",
    type: "choice" as const,
    options: ["Wedding", "Private Event", "Corporate Event", "Concert", "Lessons", "Other"],
    required: true,
  },
  {
    id: "weddingPart",
    text: "Which parts of the wedding would you like music for?",
    type: "choice" as const,
    options: ["Ceremony Only", "Ceremony + Cocktail Hour", "Reception", "Full Day"],
    conditional: {
      questionId: "eventType",
      values: ["Wedding"],
    },
  },
  {
    id: "eventDate",
    text: "When is your event taking place?",
    type: "date" as const,
    required: true,
  },
  {
    id: "eventTime",
    text: "What time will the event start?",
    type: "time" as const,
    placeholder: "e.g., 2:00 PM",
    required: true,
  },
  {
    id: "duration",
    text: "How long do you need music for?",
    type: "choice" as const,
    options: ["30 minutes", "1 hour", "2 hours", "3+ hours", "Not sure yet"],
    required: true,
  },
  {
    id: "venue",
    text: "Where will the event be held?",
    type: "text" as const,
    placeholder: "Venue name and city...",
    required: true,
  },
  {
    id: "guestCount",
    text: "Approximately how many guests are you expecting?",
    type: "choice" as const,
    options: ["Under 50", "50-100", "100-200", "200+", "Not sure"],
  },
  {
    id: "musicStyle",
    text: "What style of music are you interested in?",
    type: "choice" as const,
    options: ["Classical", "Contemporary/Pop", "Jazz", "Mix of styles", "Not sure - open to suggestions"],
  },
  {
    id: "specialSongs",
    text: "Are there any specific songs you'd like performed?",
    type: "textarea" as const,
    placeholder: "List any special song requests or first dance songs...",
    required: false,
  },
  {
    id: "name",
    text: "What's your name?",
    type: "text" as const,
    placeholder: "Your full name...",
    required: true,
  },
  {
    id: "email",
    text: "What's the best email to reach you?",
    type: "email" as const,
    placeholder: "your@email.com",
    required: true,
  },
  {
    id: "phone",
    text: "And a phone number where we can reach you?",
    type: "phone" as const,
    placeholder: "(204) 555-0123",
    required: true,
  },
  {
    id: "additionalInfo",
    text: "Anything else you'd like us to know about your event?",
    type: "textarea" as const,
    placeholder: "Special requests, questions, or additional details...",
    required: false,
  },
]

interface BookingQuestionnaireProps {
  onComplete?: (data: Record<string, string>) => Promise<void>
}

export function BookingQuestionnaire({ onComplete }: BookingQuestionnaireProps) {
  const handleComplete = async (answers: { questionId: string; value: string; displayValue?: string }[]) => {
    // Convert answers array to object
    const data: Record<string, string> = {}
    answers.forEach(answer => {
      data[answer.questionId] = answer.value
    })

    if (onComplete) {
      await onComplete(data)
    } else {
      // Default behavior: log and simulate API call
      console.log("Booking request submitted:", data)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you would typically send to your API/email service
      // Example: await fetch('/api/booking', { method: 'POST', body: JSON.stringify(data) })
    }
  }

  return (
    <TypewriterQuestionnaire
      questions={bookingQuestions}
      onComplete={handleComplete}
      title="Book Your Event"
      subtitle="Let's create something magical together"
      completionTitle="Request Received!"
      completionMessage="Thank you for your booking inquiry! Allan will review your request and get back to you within 24-48 hours."
    />
  )
}
