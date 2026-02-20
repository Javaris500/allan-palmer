"use client"

import { SITE_CONFIG, CONTACT_INFO } from "@/lib/constants"
import { Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

// Custom icons for platforms without Lucide icons
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

export function SimpleFooter() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Hide footer on booking page
  if (pathname?.startsWith("/booking")) {
    return null
  }

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/repertoire", label: "Repertoire" },
    { href: "/gallery", label: "Gallery" },
    { href: "/booking", label: "Book" },
    { href: "/contact", label: "Contact" },
  ]

  const serviceLinks = [
    { href: "/services#weddings", label: "Weddings" },
    { href: "/services#private", label: "Private Events" },
    { href: "/services#private", label: "Corporate Events" },
    { href: "/services#lessons", label: "Violin Lessons" },
  ]

  const socialLinks = [
    { href: CONTACT_INFO.socialMedia.instagram, icon: Instagram, label: "Instagram" },
    { href: CONTACT_INFO.socialMedia.youtube, icon: Youtube, label: "YouTube" },
    { href: CONTACT_INFO.socialMedia.tiktok, icon: TikTokIcon, label: "TikTok" },
    { href: CONTACT_INFO.socialMedia.spotify, icon: SpotifyIcon, label: "Spotify" },
  ]

  return (
    <footer className="bg-background py-12 md:py-16" role="contentinfo">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/images/allan-logo.png"
                alt="Allan Palmer"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
              <span className="text-xl font-serif font-semibold tracking-tight">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional violinist providing elegant music for weddings, private events, and functions in Winnipeg, Manitoba.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="break-all">{CONTACT_INFO.email}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                {CONTACT_INFO.location}
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Follow Allan</h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
