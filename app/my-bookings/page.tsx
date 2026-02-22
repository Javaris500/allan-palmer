"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ClipboardList,
  ChevronDown,
  Calendar,
  Music,
  User,
  Clock,
  MapPin,
  Users,
  MessageSquare,
  Mail,
  Search,
} from "lucide-react"
import Link from "next/link"

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface BookingMessage {
  id: string
  fromAdmin: boolean
  content: string
  createdAt: string
}

interface Booking {
  id: string
  reference: string
  status: string
  eventType: string
  eventDate: string
  timePreference: string
  venue: string | null
  guestCount: string | null
  setting: string | null
  duration: string
  musicStyles: string[]
  songRequests: string | null
  specialRequirements: string | null
  contactName: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  messages: BookingMessage[]
}

// ═══════════════════════════════════════════════════════════════════════════
// Status badge config
// ═══════════════════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "Pending",   className: "bg-amber-500/15 text-amber-500" },
  REVIEWED:  { label: "Reviewed",  className: "bg-blue-500/15 text-blue-500" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-500/15 text-green-500" },
  COMPLETED: { label: "Completed", className: "bg-gold/15 text-gold" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/15 text-red-500" },
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Email Lookup Form
// ═══════════════════════════════════════════════════════════════════════════

function EmailLookupForm({
  initialEmail,
  onSearch,
  isLoading,
}: {
  initialEmail: string
  onSearch: (email: string) => void
  isLoading: boolean
}) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      setError("Please enter your email address.")
      return
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          autoComplete="email"
          placeholder="Enter your booking email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError("")
          }}
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-950 border-t-transparent" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        {isLoading ? "Searching…" : "View My Bookings"}
      </button>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Booking List
// ═══════════════════════════════════════════════════════════════════════════

function BookingList({ bookings }: { bookings: Booking[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (bookings.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted/50 mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
          No bookings found
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
          No booking requests found for that email. Double-check the address or
          start a new request.
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-gold/90 transition-colors"
        >
          Book Allan
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking, index) => {
        const isExpanded = expandedId === booking.id
        const statusCfg =
          STATUS_CONFIG[booking.status] ?? STATUS_CONFIG["PENDING"]!

        return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-warm-md overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setExpandedId((prev) => (prev === booking.id ? null : booking.id))
                }
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {booking.eventType}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatShortDate(booking.eventDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}
                  >
                    {statusCfg.label}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/40">
                      <DetailSection title="Event Details" icon={Calendar}>
                        <DetailLine label="Event" value={booking.eventType} />
                        <DetailLine label="Date" value={formatDate(booking.eventDate)} />
                        <DetailLine label="Time" value={booking.timePreference} />
                        {booking.venue && (
                          <DetailLine label="Venue" value={booking.venue} icon={MapPin} />
                        )}
                        {booking.guestCount && (
                          <DetailLine label="Guests" value={booking.guestCount} icon={Users} />
                        )}
                        {booking.setting && (
                          <DetailLine label="Setting" value={booking.setting} />
                        )}
                      </DetailSection>

                      <DetailSection title="Performance" icon={Music}>
                        <DetailLine label="Duration" value={booking.duration} icon={Clock} />
                        {booking.musicStyles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {booking.musicStyles.map((style) => (
                              <span
                                key={style}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-foreground"
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        )}
                        {booking.songRequests && (
                          <DetailLine label="Songs" value={`\u201C${booking.songRequests}\u201D`} />
                        )}
                        {booking.specialRequirements && (
                          <DetailLine label="Notes" value={booking.specialRequirements} />
                        )}
                      </DetailSection>

                      <DetailSection title="Contact" icon={User}>
                        <DetailLine label="Name" value={booking.contactName} />
                        <DetailLine label="Email" value={booking.contactEmail} />
                        <DetailLine label="Phone" value={booking.contactPhone} />
                      </DetailSection>

                      {booking.messages.length > 0 && (
                        <DetailSection title="Messages" icon={MessageSquare}>
                          <div className="space-y-2">
                            {booking.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`rounded-lg p-2.5 text-sm ${
                                  msg.fromAdmin
                                    ? "bg-gold/10 border border-gold/20"
                                    : "bg-muted/50"
                                }`}
                              >
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  {msg.fromAdmin ? "Allan" : "You"} &middot;{" "}
                                  {formatShortDate(msg.createdAt)}
                                </p>
                                <p className="text-foreground leading-relaxed">
                                  {msg.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </DetailSection>
                      )}

                      <div className="px-5 py-3 bg-muted/20 border-t border-border/40">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Ref:{" "}
                            <span className="font-mono text-foreground">
                              {booking.reference}
                            </span>
                          </span>
                          <span>Submitted {formatShortDate(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Inner page (uses searchParams — must be inside Suspense)
// ═══════════════════════════════════════════════════════════════════════════

function MyBookingsInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const emailParam = searchParams?.get("email")?.toLowerCase().trim() ?? ""

  const [searchedEmail, setSearchedEmail] = useState(emailParam)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    setBookings([])
    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to load bookings")
      }
      const data = await res.json()
      setBookings(data.bookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-search when email comes in from URL (e.g. from booking success page)
  useEffect(() => {
    if (emailParam) {
      fetchBookings(emailParam)
    }
  }, [emailParam, fetchBookings])

  const handleSearch = (email: string) => {
    setSearchedEmail(email)
    router.replace(`/my-bookings?email=${encodeURIComponent(email)}`)
    fetchBookings(email)
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gold/15 mb-4">
            <ClipboardList className="h-6 w-6 text-gold" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the email you used when booking to see your requests.
          </p>
        </motion.div>

        {/* Lookup form */}
        <motion.div
          className="bg-card/80 border border-border/60 rounded-2xl p-6 mb-8 shadow-warm-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <EmailLookupForm
            initialEmail={searchedEmail}
            onSearch={handleSearch}
            isLoading={loading}
          />
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card/80 p-5 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted/60 rounded" />
                  </div>
                  <div className="h-6 w-20 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-muted-foreground">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        {!loading && !error && hasSearched && (
          <BookingList bookings={bookings} />
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Page export (wraps inner in Suspense for useSearchParams)
// ═══════════════════════════════════════════════════════════════════════════

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-background flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <MyBookingsInner />
    </Suspense>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Internal components
// ═══════════════════════════════════════════════════════════════════════════

function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="p-5 border-b border-border/40 last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-3.5 w-3.5 text-gold" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function DetailLine({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: React.ElementType
}) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />}
      <p className="text-sm text-foreground leading-relaxed">
        <span className="text-muted-foreground">{label}:</span> {value}
      </p>
    </div>
  )
}
