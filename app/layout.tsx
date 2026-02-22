import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { FloatingNav } from "@/components/floating-nav"
import { SimpleFooter } from "@/components/simple-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { BackgroundMusicProvider } from "@/contexts/background-music-context"

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
    default: "Allan Palmer - Professional Violinist for Events of All Types",
    template: "%s | Allan Palmer Violinist",
  },
  description:
    "Professional violinist Allan Palmer brings elegance and sophistication to weddings, corporate events, and private functions. Book your memorable performance today.",
  keywords: [
    "violinist for events",
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
    siteName: "Allan Palmer - Professional Violinist for Events of All Types",
    title: "Allan Palmer - Professional Violinist for Events of All Types",
    description:
      "Professional violinist bringing elegance to your special events. Wedding ceremonies, corporate functions, and private performances.",
    images: [
      {
        url: "/images/allan-portrait-bw.jpeg",
        width: 1200,
        height: 630,
        alt: "Allan Palmer - Professional Violinist for Events of All Types",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Allan Palmer - Professional Violinist for Events of All Types",
    description:
      "Professional violinist bringing elegance to your special events. Wedding ceremonies, corporate functions, and private performances.",
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
  generator: "v0.app",
}

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.mux.com" />
        <link rel="preconnect" href="https://stream.mux.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        <link rel="prefetch" href="/about" as="document" />
        <link rel="prefetch" href="/services" as="document" />
        <link rel="prefetch" href="/contact" as="document" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <BackgroundMusicProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
              >
                Skip to main content
              </a>
              <div className="flex min-h-screen flex-col">
                <Suspense fallback={<PageLoading />}>
                  <main id="main-content" className="flex-1">{children}</main>
                </Suspense>
                <SimpleFooter />
                <FloatingNav />
              </div>
            </BackgroundMusicProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
