import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Extended grayscale with warm undertones
        gray: {
          50: "hsl(var(--gray-50))",
          100: "hsl(var(--gray-100))",
          200: "hsl(var(--gray-200))",
          300: "hsl(var(--gray-300))",
          400: "hsl(var(--gray-400))",
          500: "hsl(var(--gray-500))",
          600: "hsl(var(--gray-600))",
          700: "hsl(var(--gray-700))",
          800: "hsl(var(--gray-800))",
          900: "hsl(var(--gray-900))",
          950: "hsl(var(--gray-950))",
        },
        // Editorial gold trio — classic / champagne highlight / bronze subtle
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        champagne: "hsl(var(--champagne))",
        bronze: "hsl(var(--bronze))",
        // Parchment/cream for text + light surfaces
        parchment: "hsl(var(--parchment))",
        cream: "hsl(var(--cream))",
        ink: "hsl(var(--ink))",
        // Elevated surface layers for editorial depth
        "bg-elevated": "hsl(var(--bg-elevated))",
        surface: "hsl(var(--surface))",
        // Semantic colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Fluid typography scale
      fontSize: {
        "fluid-xs": [
          "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
          { lineHeight: "1.5" },
        ],
        "fluid-sm": [
          "clamp(0.875rem, 0.8rem + 0.35vw, 1rem)",
          { lineHeight: "1.5" },
        ],
        "fluid-base": [
          "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)",
          { lineHeight: "1.6" },
        ],
        "fluid-lg": [
          "clamp(1.125rem, 1rem + 0.6vw, 1.25rem)",
          { lineHeight: "1.5" },
        ],
        "fluid-xl": [
          "clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)",
          { lineHeight: "1.4" },
        ],
        "fluid-2xl": [
          "clamp(1.5rem, 1.25rem + 1.25vw, 2rem)",
          { lineHeight: "1.3" },
        ],
        "fluid-3xl": [
          "clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)",
          { lineHeight: "1.2" },
        ],
        "fluid-4xl": [
          "clamp(2.25rem, 1.75rem + 2.5vw, 3rem)",
          { lineHeight: "1.1" },
        ],
        "fluid-5xl": ["clamp(3rem, 2rem + 5vw, 4.5rem)", { lineHeight: "1" }],
        "fluid-hero": [
          "clamp(2.5rem, 1.5rem + 5vw, 6rem)",
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ],
      },
      // Enhanced shadow system for B&W depth
      boxShadow: {
        "warm-sm": "0 1px 2px 0 rgba(23, 21, 19, 0.05)",
        "warm-md":
          "0 4px 6px -1px rgba(23, 21, 19, 0.07), 0 2px 4px -2px rgba(23, 21, 19, 0.05)",
        "warm-lg":
          "0 10px 15px -3px rgba(23, 21, 19, 0.08), 0 4px 6px -4px rgba(23, 21, 19, 0.05)",
        "warm-xl":
          "0 20px 25px -5px rgba(23, 21, 19, 0.1), 0 8px 10px -6px rgba(23, 21, 19, 0.05)",
        "warm-2xl": "0 25px 50px -12px rgba(23, 21, 19, 0.2)",
        "inner-warm": "inset 0 2px 4px 0 rgba(23, 21, 19, 0.05)",
        // Elevation system
        "elevation-1":
          "0 1px 3px rgba(23, 21, 19, 0.08), 0 1px 2px rgba(23, 21, 19, 0.06)",
        "elevation-2":
          "0 4px 6px rgba(23, 21, 19, 0.07), 0 2px 4px rgba(23, 21, 19, 0.06)",
        "elevation-3":
          "0 10px 20px rgba(23, 21, 19, 0.08), 0 3px 6px rgba(23, 21, 19, 0.05)",
        "elevation-4":
          "0 15px 25px rgba(23, 21, 19, 0.1), 0 5px 10px rgba(23, 21, 19, 0.06)",
        "elevation-5": "0 20px 40px rgba(23, 21, 19, 0.12)",
        // Editorial glow — gold luminance on dark surfaces
        "glow-gold":
          "0 0 20px 4px hsl(43 55% 54% / 0.25), 0 4px 16px rgba(0, 0, 0, 0.4)",
        "glow-champagne":
          "0 0 24px 2px hsl(40 48% 65% / 0.18), 0 2px 12px rgba(0, 0, 0, 0.35)",
        // Dark-mode aware shadows (deeper blacks for visibility on dark surfaces)
        "dark-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.45)",
        "dark-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.55), 0 2px 4px -2px rgba(0, 0, 0, 0.35)",
        "dark-lg":
          "0 10px 20px -3px rgba(0, 0, 0, 0.65), 0 4px 8px -4px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          from: { transform: "translateX(-20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-8deg)" },
          "60%": { transform: "rotate(14deg)" },
          "80%": { transform: "rotate(-4deg)" },
          "100%": { transform: "rotate(10deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideIn: "slideIn 0.5s ease-out",
        slideInLeft: "slideInLeft 0.5s ease-out",
        slideInRight: "slideInRight 0.5s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        wave: "wave 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "progress-fill": "progress-fill 0.5s ease-out forwards",
      },
      fontFamily: {
        // Editorial display — Cormorant Garamond (light weights preferred)
        display: ["var(--font-display)", "Georgia", "serif"],
        // Label / small-caps accents — Tenor Sans
        label: ["var(--font-label)", "system-ui", "sans-serif"],
        // Body — Inter
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Legacy alias — serif maps to new display (Cormorant) so existing
        // `font-serif` usage inherits the editorial upgrade without churn.
        serif: ["var(--font-display)", "Georgia", "serif"],
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionTimingFunction: {
        // Cinematic ease — for cross-site Framer Motion parity, use lib/motion.ts
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
