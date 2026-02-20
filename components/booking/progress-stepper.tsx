"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  className?: string
}

export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: ProgressStepperProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Mobile View - Simple Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps[currentStep]?.title ?? ""}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Desktop View - Full Stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = index <= currentStep && onStepClick

          return (
            <div key={step.id} className="flex-1 flex items-center">
              {/* Step Circle + Label */}
              <div
                className={cn(
                  "flex flex-col items-center relative z-10",
                  isClickable && "cursor-pointer"
                )}
                onClick={() => isClickable && onStepClick(index)}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground"
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground hidden lg:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-muted relative">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
