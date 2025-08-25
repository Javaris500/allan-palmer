import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { BackToTop } from "@/components/back-to-top"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

// Optimized font loading
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
  fallback: ["serif"],
})

export const metadata: Metadata = {
  title: {
    default: "Allan Palmer - Professional Classical Violinist",
    template: "%s | Allan Palmer Violinist",
  },
  description:
    "Professional classical violinist Allan Palmer brings elegance and sophistication to weddings, corporate events, and private functions. Book your memorable performance today.",
  keywords: [
    "classical violinist",
    "wedding musician",
    "corporate entertainment",
    "private events",
    "Allan Palmer",
    "violin performance",
    "classical music",
    "live music",
    "professional musician",
    "event entertainment",
  ],
  authors: [{ name: "Allan Palmer" }],
  creator: "Allan Palmer",
  publisher: "Allan Palmer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://allanpalmerviolinist.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://allanpalmerviolinist.com",
    siteName: "Allan Palmer - Professional Classical Violinist",
    title: "Allan Palmer - Professional Classical Violinist",
    description:
      "Professional classical violinist bringing elegance to your special events. Wedding ceremonies, corporate functions, and private performances.",
    images: [
      {
        url: "/images/allan-portrait-bw.jpeg",
        width: 1200,
        height: 630,
        alt: "Allan Palmer - Professional Classical Violinist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Allan Palmer - Professional Classical Violinist",
    description:
      "Professional classical violinist bringing elegance to your special events. Wedding ceremonies, corporate functions, and private performances.",
    images: ["/images/allan-portrait-bw.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

// Loading component for Suspense
function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.mux.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/hero-background-outdoor.jpeg" as="image" type="image/jpeg" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <Suspense fallback={<PageLoading />}>
                <main className="flex-1">{children}</main>
              </Suspense>
              <Footer />
              <BackToTop />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
