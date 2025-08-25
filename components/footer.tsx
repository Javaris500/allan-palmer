import { Music, Instagram, Youtube, Facebook } from "lucide-react"
import { CONTACT_INFO, SITE_CONFIG } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <Music className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional violinist available for weddings, corporate events, and private functions.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href={CONTACT_INFO.socialMedia.instagram}
                className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow Allan Palmer on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_INFO.socialMedia.youtube}
                className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Subscribe to Allan Palmer on YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_INFO.socialMedia.facebook}
                className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow Allan Palmer on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={CONTACT_INFO.socialMedia.spotify}
                className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Listen to Allan Palmer on Spotify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </a>
              <a
                href={CONTACT_INFO.socialMedia.tiktok}
                className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow Allan Palmer on TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-2 lg:col-span-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">Weddings</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Corporate Events</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Private Functions</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Learning</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">Violin Lessons</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Resources</span>
                </li>
                <li>
                  <span className="text-muted-foreground">FAQ</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">Get in Touch</span>
                </li>
                <li>
                  <span className="text-muted-foreground">Book Now</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
