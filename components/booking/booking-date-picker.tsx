"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addDays,
} from "date-fns"

// ═══════════════════════════════════════════════════════════════════════════
// Booking Date Picker — Custom styled calendar
// ═══════════════════════════════════════════════════════════════════════════
// Gold accent on selected date, disabled dates before tomorrow.

interface BookingDatePickerProps {
  value: string // ISO date string
  onChange: (dateISO: string) => void
  className?: string
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function BookingDatePicker({
  value,
  onChange,
  className = "",
}: BookingDatePickerProps) {
  const selectedDate = value ? new Date(value) : null
  const [viewDate, setViewDate] = useState(
    selectedDate ?? addDays(new Date(), 1),
  )

  const minDate = startOfDay(addDays(new Date(), 1)) // tomorrow

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(viewDate)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [viewDate])

  const handleSelect = (day: Date) => {
    if (isBefore(day, minDate)) return
    onChange(format(day, "yyyy-MM-dd"))
  }

  return (
    <motion.div
      className={`w-full max-w-sm mx-auto ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 shadow-warm-sm">
        {/* Header: month/year + nav arrows */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setViewDate((d) => subMonths(d, 1))}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {format(viewDate, "MMMM yyyy")}
          </span>
          <button
            type="button"
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={format(viewDate, "yyyy-MM")}
            className="grid grid-cols-7 gap-1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {calendarDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, viewDate)
              const isSelected = selectedDate
                ? isSameDay(day, selectedDate)
                : false
              const isDisabled = isBefore(day, minDate)
              const isToday = isSameDay(day, new Date())

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleSelect(day)}
                  disabled={isDisabled}
                  className={`
                    relative h-9 w-full rounded-lg text-sm font-medium
                    transition-all duration-150
                    ${!isCurrentMonth ? "text-muted-foreground/30" : ""}
                    ${
                      isDisabled
                        ? "text-muted-foreground/20 cursor-not-allowed"
                        : "hover:bg-muted cursor-pointer"
                    }
                    ${
                      isSelected
                        ? "bg-gold text-gray-950 hover:bg-gold/90 font-semibold"
                        : ""
                    }
                    ${isToday && !isSelected ? "ring-1 ring-gold/30" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* Selected date display */}
        {selectedDate && (
          <motion.p
            className="text-center text-sm text-gold font-medium mt-3 pt-3 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
