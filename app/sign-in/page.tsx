"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { signInAction, type SignInState } from "./actions";

const initialState: SignInState = { status: "idle" };

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") ?? "/";

  const [state, action] = useFormState(signInAction, initialState);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="w-full max-w-md relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/images/allan-logo.png"
              alt="Allan Palmer"
              width={56}
              height={56}
              className="mx-auto opacity-90"
              priority
            />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-wide">
            Welcome
          </h1>
          <div className="mx-auto w-12 h-px bg-gold/40 mt-4 mb-4" />
          <p className="text-sm text-muted-foreground">
            Sign in to chat with Leah and manage your bookings.
          </p>
        </div>

        {/* Form */}
        <motion.form
          action={action}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <FieldUnderline
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            autoFocus
            required
            autoComplete="email"
          />

          <FieldUnderline
            label="Password"
            name="password"
            type="password"
            placeholder="•••••••• (min 6 characters)"
            icon={<Lock className="h-4 w-4" />}
            required
            autoComplete="current-password"
          />

          <SubmitButton />

          <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
            New here? Just enter your email and a password &mdash; we&rsquo;ll
            set up your account automatically.
          </p>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {state.status === "error" && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-sm text-destructive"
            >
              {state.message}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-xs text-muted-foreground/60">
          <Link href="/" className="hover:text-gold transition-colors">
            &larr; Return to site
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Premium underline-only input (per UI-UX audit)
// ──────────────────────────────────────────────
function FieldUnderline({
  label,
  name,
  type,
  placeholder,
  icon,
  autoFocus,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  autoFocus?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-2">
      <label
        htmlFor={`signin-${name}`}
        className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 font-medium"
      >
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden
          className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${
            focused ? "text-gold" : "text-muted-foreground/60"
          }`}
        >
          {icon}
        </span>
        <input
          id={`signin-${name}`}
          name={name}
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          required={required}
          autoComplete={autoComplete}
          minLength={type === "password" ? 6 : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-0 border-b border-border/50 pl-7 pr-0 py-2.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold transition-colors"
        />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group w-full flex items-center justify-center gap-2 bg-gold text-gray-950 text-xs uppercase tracking-[0.2em] font-semibold px-6 py-3.5 hover:bg-gold/90 disabled:opacity-60 disabled:cursor-wait transition-all"
    >
      {pending ? "Signing in…" : "Continue"}
      {!pending && (
        <span className="inline-flex transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
