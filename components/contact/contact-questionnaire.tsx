"use client"

import { TypewriterQuestionnaire } from "@/components/ui/typewriter-questionnaire"

const contactQuestions = [
  {
    id: "purpose",
    text: "What can I help you with today?",
    type: "choice" as const,
    options: ["Booking Inquiry", "General Question", "Lesson Information", "Collaboration", "Other"],
    required: true,
  },
  {
    id: "name",
    text: "Great! What's your name?",
    type: "text" as const,
    placeholder: "Your full name...",
    required: true,
  },
  {
    id: "email",
    text: "What's the best email to reach you at?",
    type: "email" as const,
    placeholder: "your@email.com",
    required: true,
  },
  {
    id: "phone",
    text: "Would you like to share a phone number? (Optional)",
    type: "phone" as const,
    placeholder: "(204) 555-0123",
    required: false,
  },
  {
    id: "eventDate",
    text: "Do you have a specific date in mind for your event?",
    type: "date" as const,
    conditional: {
      questionId: "purpose",
      values: ["Booking Inquiry"],
    },
  },
  {
    id: "lessonType",
    text: "What type of lessons are you interested in?",
    type: "choice" as const,
    options: ["Beginner", "Intermediate", "Advanced", "Not sure - need assessment"],
    conditional: {
      questionId: "purpose",
      values: ["Lesson Information"],
    },
  },
  {
    id: "lessonFormat",
    text: "Do you prefer in-person or online lessons?",
    type: "choice" as const,
    options: ["In-Person (Winnipeg)", "Online", "Either works"],
    conditional: {
      questionId: "purpose",
      values: ["Lesson Information"],
    },
  },
  {
    id: "message",
    text: "Tell me more about what you're looking for.",
    type: "textarea" as const,
    placeholder: "Share your questions, event details, or anything you'd like me to know...",
    required: true,
  },
  {
    id: "howFound",
    text: "One last question - how did you hear about me?",
    type: "choice" as const,
    options: ["Google Search", "Social Media", "Referral", "Wedding Vendor", "Saw a Performance", "Other"],
    required: false,
  },
]

interface ContactQuestionnaireProps {
  onComplete?: (data: Record<string, string>) => Promise<void>
}

export function ContactQuestionnaire({ onComplete }: ContactQuestionnaireProps) {
  const handleComplete = async (answers: { questionId: string; value: string; displayValue?: string }[]) => {
    // Convert answers array to object
    const data: Record<string, string> = {}
    answers.forEach(answer => {
      data[answer.questionId] = answer.value
    })

    if (onComplete) {
      await onComplete(data)
    } else {
      // Default behavior: simulate API call
      // Integration point: send to API/email service
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  }

  return (
    <TypewriterQuestionnaire
      questions={contactQuestions}
      onComplete={handleComplete}
      title="Get In Touch"
      subtitle="I'd love to hear from you"
      completionTitle="Message Sent!"
      completionMessage="Thank you for reaching out! I'll review your message and get back to you as soon as possible, usually within 24 hours."
    />
  )
}
