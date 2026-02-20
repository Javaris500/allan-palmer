"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import { signIn } from "next-auth/react"
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuthModal } from "@/contexts/auth-modal-context"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TAB_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
  }),
}

const TAB_TRANSITION = {
  x: { type: "spring", stiffness: 350, damping: 30 },
  opacity: { duration: 0.2 },
} as const

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { key: "uppercase", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { key: "number", label: "One number", test: (v: string) => /\d/.test(v) },
] as const

// ---------------------------------------------------------------------------
// Inline field error
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <motion.p
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </motion.p>
  )
}

// ---------------------------------------------------------------------------
// Treble clef SVG (decorative)
// ---------------------------------------------------------------------------

function TrebleClef({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 18c0 1.657 1.343 3 3 3s3-1.343 3-3-1.343-3-3-3-3 1.343-3 3z" />
      <path d="M12 15V3" />
      <path d="M15.5 8.5c0-2.485-1.567-4.5-3.5-4.5S8.5 6.015 8.5 8.5c0 3 3.5 4.5 3.5 6.5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Google icon (inline SVG for crisp rendering)
// ---------------------------------------------------------------------------

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

function OrDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          or continue with
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Password strength indicator (signup only)
// ---------------------------------------------------------------------------

function PasswordRequirements({ password }: { password: string }) {
  if (!password) return null

  return (
    <motion.ul
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-1"
    >
      {PASSWORD_RULES.map(({ key, label, test }) => {
        const passes = test(password)
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors duration-200",
              passes ? "text-success" : "text-muted-foreground",
            )}
          >
            {passes ? (
              <Check className="h-3 w-3" />
            ) : (
              <span className="inline-block h-3 w-3 rounded-full border border-current" />
            )}
            {label}
          </li>
        )
      })}
    </motion.ul>
  )
}

// ---------------------------------------------------------------------------
// Sign-in form
// ---------------------------------------------------------------------------

interface FormErrors {
  [key: string]: string | undefined
}

// Check if Google OAuth is configured on the server
function useGoogleEnabled() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.google))
      .catch(() => setEnabled(false))
  }, [])
  return enabled
}

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const googleEnabled = useGoogleEnabled()

  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus email field when form mounts
    const timer = setTimeout(() => emailRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  const validate = useCallback((): boolean => {
    const next: FormErrors = {}
    if (!email.trim()) {
      next.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address"
    }
    if (!password) {
      next.password = "Password is required"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [email, password])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setServerError("")
      if (!validate()) return

      setIsLoading(true)
      try {
        const result = await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        })

        if (result?.error) {
          setServerError("Invalid email or password. Please try again.")
        } else {
          onSuccess()
        }
      } catch {
        setServerError("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [email, password, validate, onSuccess],
  )

  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch {
      setServerError("Could not connect to Google. Please try again.")
      setIsGoogleLoading(false)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Server error banner */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="signin-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={emailRef}
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
            }}
            className={cn("pl-9", errors.email && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signin-email-error" : undefined}
          />
        </div>
        <AnimatePresence>
          {errors.email && <FieldError message={errors.email} />}
        </AnimatePresence>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="signin-password">Password</Label>
          <button
            type="button"
            className="text-xs text-gold hover:text-gold/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            onClick={() => {
              // In production, this would open a reset-password flow
            }}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
            }}
            className={cn("pl-9 pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "signin-password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && <FieldError message={errors.password} />}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {googleEnabled && (
        <>
          <OrDivider />
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-5 w-5" />
            )}
            Continue with Google
          </Button>
        </>
      )}
    </form>
  )
}

// ---------------------------------------------------------------------------
// Register form
// ---------------------------------------------------------------------------

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const googleEnabled = useGoogleEnabled()

  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => nameRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  const validate = useCallback((): boolean => {
    const next: FormErrors = {}
    if (!name.trim()) {
      next.name = "Name is required"
    }
    if (!email.trim()) {
      next.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address"
    }
    if (!password) {
      next.password = "Password is required"
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters"
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [name, email, password, confirmPassword])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setServerError("")
      if (!validate()) return

      setIsLoading(true)
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setServerError(data.error || "Registration failed. Please try again.")
          return
        }

        // Auto sign-in after successful registration
        const signInResult = await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        })

        if (signInResult?.error) {
          // Account was created, but auto-sign-in failed -- still a success
          onSuccess()
        } else {
          onSuccess()
        }
      } catch {
        setServerError("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [name, email, password, confirmPassword, validate, onSuccess],
  )

  const handleGoogleSignUp = useCallback(async () => {
    setIsGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch {
      setServerError("Could not connect to Google. Please try again.")
      setIsGoogleLoading(false)
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="register-name">Full Name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={nameRef}
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
            }}
            className={cn("pl-9", errors.name && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!errors.name}
          />
        </div>
        <AnimatePresence>
          {errors.name && <FieldError message={errors.name} />}
        </AnimatePresence>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="register-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
            }}
            className={cn("pl-9", errors.email && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!errors.email}
          />
        </div>
        <AnimatePresence>
          {errors.email && <FieldError message={errors.email} />}
        </AnimatePresence>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="register-password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
            }}
            className={cn("pl-9 pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && <FieldError message={errors.password} />}
        </AnimatePresence>
        <AnimatePresence>
          <PasswordRequirements password={password} />
        </AnimatePresence>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="register-confirm">Confirm Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword)
                setErrors((p) => ({ ...p, confirmPassword: undefined }))
            }}
            className={cn("pl-9 pr-10", errors.confirmPassword && "border-destructive focus-visible:ring-destructive")}
            aria-invalid={!!errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.confirmPassword && (
            <FieldError message={errors.confirmPassword} />
          )}
        </AnimatePresence>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {googleEnabled && (
        <>
          <OrDivider />
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignUp}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="h-5 w-5" />
            )}
            Continue with Google
          </Button>
        </>
      )}
    </form>
  )
}

// ---------------------------------------------------------------------------
// AuthModal (main export)
// ---------------------------------------------------------------------------

export function AuthModal() {
  const { isOpen, activeTab, closeAuthModal, setActiveTab } = useAuthModal()

  // Track direction for animation (1 = moving right / forward, -1 = left)
  const [direction, setDirection] = useState(0)

  const switchTab = useCallback(
    (tab: "signin" | "register") => {
      setDirection(tab === "register" ? 1 : -1)
      setActiveTab(tab)
    },
    [setActiveTab],
  )

  const handleSuccess = useCallback(() => {
    closeAuthModal()
    // Page will re-render via next-auth session update
    window.location.reload()
  }, [closeAuthModal])

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        <DialogPrimitive.Content
          aria-describedby="auth-modal-description"
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-border bg-background shadow-elevation-5",
            "p-0 overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200 focus:outline-none",
          )}
        >
          {/* ---- Header with decorative accent ---- */}
          <div className="relative border-b border-border bg-card px-6 pb-5 pt-6">
            {/* Decorative gold line at top */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Close button */}
            <DialogPrimitive.Close
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>

            {/* Title area with treble clef */}
            <div className="flex items-center gap-2">
              <TrebleClef className="h-6 w-6 text-gold" />
              <DialogPrimitive.Title className="font-serif text-xl font-semibold tracking-tight">
                {activeTab === "signin" ? "Welcome Back" : "Join Us"}
              </DialogPrimitive.Title>
            </div>

            <DialogPrimitive.Description
              id="auth-modal-description"
              className="mt-1 text-sm text-muted-foreground"
            >
              {activeTab === "signin"
                ? "Sign in to your Allan Palmer account"
                : "Create an account to book performances and more"}
            </DialogPrimitive.Description>

            {/* Custom tab bar */}
            <div
              className="relative mt-5 flex rounded-lg bg-muted p-1"
              role="tablist"
              aria-label="Authentication method"
            >
              {/* Sliding indicator */}
              <motion.div
                className="absolute inset-y-1 rounded-md bg-background shadow-warm-sm"
                layoutId="auth-tab-indicator"
                style={{ width: "calc(50% - 4px)" }}
                animate={{ x: activeTab === "signin" ? 4 : "calc(100% + 4px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />

              <button
                role="tab"
                aria-selected={activeTab === "signin"}
                aria-controls="panel-signin"
                id="tab-signin"
                className={cn(
                  "relative z-10 flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
                  activeTab === "signin"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80",
                )}
                onClick={() => switchTab("signin")}
              >
                Sign In
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "register"}
                aria-controls="panel-register"
                id="tab-register"
                className={cn(
                  "relative z-10 flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
                  activeTab === "register"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80",
                )}
                onClick={() => switchTab("register")}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* ---- Tab panels ---- */}
          <div className="relative min-h-[380px] overflow-hidden px-6 py-6">
            <AnimatePresence mode="wait" custom={direction}>
              {activeTab === "signin" ? (
                <motion.div
                  key="signin"
                  id="panel-signin"
                  role="tabpanel"
                  aria-labelledby="tab-signin"
                  custom={direction}
                  variants={TAB_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={TAB_TRANSITION}
                >
                  <SignInForm onSuccess={handleSuccess} />

                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("register")}
                      className="font-medium text-gold hover:text-gold/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    >
                      Create one
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  id="panel-register"
                  role="tabpanel"
                  aria-labelledby="tab-register"
                  custom={direction}
                  variants={TAB_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={TAB_TRANSITION}
                >
                  <RegisterForm onSuccess={handleSuccess} />

                  <p className="mt-6 text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("signin")}
                      className="font-medium text-gold hover:text-gold/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    >
                      Sign in
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- Footer ---- */}
          <div className="border-t border-border bg-card px-6 py-3">
            <p className="text-center text-[11px] text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
