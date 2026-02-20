"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Send, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Check, 
  Loader2,
  Music,
  Sparkles,
  ArrowLeft
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Question types
type QuestionType = "choice" | "text" | "email" | "phone" | "date" | "textarea" | "time" | "number"

interface Question {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  placeholder?: string
  required?: boolean
  validation?: (value: string) => string | null
  conditional?: {
    questionId: string
    values: string[]
  }
}

interface Answer {
  questionId: string
  value: string
  displayValue?: string
}

interface TypewriterQuestionnaireProps {
  questions: Question[]
  onComplete: (answers: Answer[]) => Promise<void>
  title?: string
  subtitle?: string
  completionTitle?: string
  completionMessage?: string
}

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 30, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    setDisplayedText("")
    setIsComplete(false)
    let index = 0

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, enabled])

  return { displayedText, isComplete }
}

// Chat bubble component
function ChatBubble({ 
  children, 
  isUser = false,
  animate = true 
}: { 
  children: React.ReactNode
  isUser?: boolean
  animate?: boolean
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "max-w-[85%] rounded-2xl px-4 py-3",
        isUser 
          ? "ml-auto bg-gold text-black rounded-br-md" 
          : "mr-auto bg-muted rounded-bl-md"
      )}
    >
      {children}
    </motion.div>
  )
}

// Question bubble with typewriter
function QuestionBubble({ 
  question, 
  onTypingComplete 
}: { 
  question: Question
  onTypingComplete: () => void
}) {
  const { displayedText, isComplete } = useTypewriter(question.text, 25)

  useEffect(() => {
    if (isComplete) {
      onTypingComplete()
    }
  }, [isComplete, onTypingComplete])

  return (
    <ChatBubble isUser={false}>
      <p className="text-foreground">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-gold ml-0.5 animate-pulse" />
        )}
      </p>
    </ChatBubble>
  )
}

// Progress indicator
function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {current} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export function TypewriterQuestionnaire({
  questions,
  onComplete,
  title = "Let's Get Started",
  subtitle = "Answer a few questions to help us understand your needs",
  completionTitle = "Thank You!",
  completionMessage = "We've received your information and will be in touch soon.",
}: TypewriterQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState<Answer[]>([])
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter questions based on conditional logic
  const activeQuestions = questions.filter(q => {
    if (!q.conditional) return true
    const conditionAnswer = answers.find(a => a.questionId === q.conditional!.questionId)
    return conditionAnswer && q.conditional.values.includes(conditionAnswer.value)
  })

  const currentQuestion = activeQuestions[currentQuestionIndex]
  const totalQuestions = activeQuestions.length

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [showHistory, currentQuestionIndex, isTypingComplete])

  // Focus input when typing is complete
  useEffect(() => {
    if (isTypingComplete && inputRef.current && currentQuestion?.type !== "choice") {
      inputRef.current.focus()
    }
  }, [isTypingComplete, currentQuestion])

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true)
  }, [])

  const validateInput = (value: string): string | null => {
    if (!currentQuestion) return null
    
    if (currentQuestion.required && !value.trim()) {
      return "This field is required"
    }

    if (currentQuestion.validation) {
      return currentQuestion.validation(value)
    }

    if (currentQuestion.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address"
      }
    }

    if (currentQuestion.type === "phone") {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
      if (!phoneRegex.test(value)) {
        return "Please enter a valid phone number"
      }
    }

    return null
  }

  const submitAnswer = (value: string, displayValue?: string) => {
    if (!currentQuestion) return
    
    const validationError = validateInput(value)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value,
      displayValue: displayValue || value,
    }

    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)
    setShowHistory([...showHistory, newAnswer])
    setInputValue("")
    setSelectedDate(undefined)
    setIsTypingComplete(false)

    // Check if there are more questions
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // All questions answered, submit
      handleSubmit(newAnswers)
    }
  }

  const handleSubmit = async (finalAnswers: Answer[]) => {
    setIsSubmitting(true)
    try {
      await onComplete(finalAnswers)
      setIsComplete(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault()
      submitAnswer(inputValue)
    }
  }

  const handleGoBack = () => {
    if (currentQuestionIndex > 0 && showHistory.length > 0) {
      // Remove the last answer
      const newAnswers = answers.slice(0, -1)
      const newHistory = showHistory.slice(0, -1)
      setAnswers(newAnswers)
      setShowHistory(newHistory)
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setIsTypingComplete(false)
      setError(null)
    }
  }

  // Completion state
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border shadow-lg p-8 text-center max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="h-10 w-10 text-gold" />
        </motion.div>
        <h3 className="font-serif text-2xl font-bold mb-3">{completionTitle}</h3>
        <p className="text-muted-foreground">{completionMessage}</p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 pt-6 border-t"
        >
          <p className="text-sm text-muted-foreground mb-2">Summary of your responses:</p>
          <div className="text-left space-y-2 max-h-48 overflow-y-auto">
            {answers.map((answer, index) => {
              const question = questions.find(q => q.id === answer.questionId)
              return (
                <div key={index} className="text-sm">
                  <span className="text-muted-foreground">{question?.text.replace("?", "")}: </span>
                  <span className="font-medium">{answer.displayValue}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="bg-card rounded-2xl border shadow-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
            <Music className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold">{title}</h3>
            <p className="text-sm text-gray-300">{subtitle}</p>
          </div>
        </div>
        <ProgressIndicator current={currentQuestionIndex + 1} total={totalQuestions} />
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="h-[350px] overflow-y-auto p-4 space-y-4 bg-background/50"
      >
        {/* Welcome message */}
        <ChatBubble isUser={false} animate={false}>
          <p className="text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            Hi there! Let's find the perfect music for your event.
          </p>
        </ChatBubble>

        {/* Previous Q&A History */}
        {showHistory.map((answer, index) => {
          const question = questions.find(q => q.id === answer.questionId)
          return (
            <div key={index} className="space-y-3">
              <ChatBubble isUser={false} animate={false}>
                <p className="text-foreground">{question?.text}</p>
              </ChatBubble>
              <ChatBubble isUser={true} animate={false}>
                <p>{answer.displayValue}</p>
              </ChatBubble>
            </div>
          )
        })}

        {/* Current Question */}
        {currentQuestion && !isSubmitting && (
          <QuestionBubble 
            question={currentQuestion} 
            onTypingComplete={handleTypingComplete}
          />
        )}

        {/* Loading state */}
        {isSubmitting && (
          <ChatBubble isUser={false}>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
              <span>Processing your request...</span>
            </div>
          </ChatBubble>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-card p-4">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm mb-3"
          >
            {error}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {isTypingComplete && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Choice buttons */}
              {currentQuestion.type === "choice" && currentQuestion.options && (
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="sm"
                      onClick={() => submitAnswer(option)}
                      className="hover:bg-gold hover:text-black hover:border-gold transition-colors"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {/* Date picker */}
              {currentQuestion.type === "date" && (
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedDate && (
                    <Button
                      onClick={() => submitAnswer(
                        selectedDate.toISOString(),
                        format(selectedDate, "MMMM d, yyyy")
                      )}
                      className="bg-gold hover:bg-gold/90 text-black"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {/* Text input */}
              {(currentQuestion.type === "text" || 
                currentQuestion.type === "email" || 
                currentQuestion.type === "phone" ||
                currentQuestion.type === "number" ||
                currentQuestion.type === "time") && (
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    type={currentQuestion.type === "email" ? "email" : 
                          currentQuestion.type === "phone" ? "tel" :
                          currentQuestion.type === "number" ? "number" :
                          currentQuestion.type === "time" ? "time" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentQuestion.placeholder || "Type your answer..."}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => submitAnswer(inputValue)}
                    disabled={!inputValue.trim()}
                    className="bg-gold hover:bg-gold/90 text-black disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Textarea */}
              {currentQuestion.type === "textarea" && (
                <div className="space-y-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestion.placeholder || "Type your message..."}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => submitAnswer(inputValue)}
                      disabled={!inputValue.trim() && currentQuestion.required}
                      className="bg-gold hover:bg-gold/90 text-black disabled:opacity-50"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back button */}
        {currentQuestionIndex > 0 && isTypingComplete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="mt-3 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to previous question
          </Button>
        )}
      </div>
    </div>
  )
}
