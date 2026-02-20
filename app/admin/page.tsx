"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Home,
  User,
  Image as ImageIcon,
  Film,
  Music,
  Star,
  Briefcase,
  Calendar,
  HelpCircle,
  Settings,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Layout,
  FileText,
  Globe,
  BookOpen,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ═══════════════════════════════════════════════════════
// Field documentation data — every editable field mapped
// to where it appears on the site
// ═══════════════════════════════════════════════════════

interface FieldDoc {
  field: string
  description: string
  type: string
  required?: boolean
}

interface ContentSection {
  id: string
  title: string
  icon: React.ElementType
  description: string
  appearsOn: string[]
  isSingleton?: boolean
  fields: FieldDoc[]
}

const contentSections: ContentSection[] = [
  {
    id: "siteSettings",
    title: "Site Settings",
    icon: Settings,
    description: "Global settings that appear across every page of your website.",
    appearsOn: ["All Pages — Header, Footer, Contact Info, SEO"],
    isSingleton: true,
    fields: [
      { field: "Site Name", description: "Your name/brand shown in browser tabs and SEO", type: "Text", required: true },
      { field: "Site Description", description: "SEO description shown in Google search results", type: "Long Text" },
      { field: "Email Address", description: "Shown on Contact page and in the footer", type: "Email" },
      { field: "Phone Number", description: "Shown on Contact page and in the footer", type: "Phone" },
      { field: "Location", description: "Displayed on Contact page (e.g., 'Winnipeg, Manitoba')", type: "Text" },
      { field: "Social Media Links", description: "Instagram, YouTube, TikTok, Spotify, Facebook URLs — shown in footer and contact page", type: "URLs" },
      { field: "Hero Image", description: "Fallback hero background image if no video is set", type: "Image" },
      { field: "Hero Title", description: "Main heading on the homepage (default: 'Allan Palmer')", type: "Text" },
      { field: "Hero Subtitle", description: "Sub-heading below title (default: 'Violinist for Events of All Types')", type: "Text" },
      { field: "Hero Description", description: "Short tagline below subtitle on homepage", type: "Long Text" },
    ],
  },
  {
    id: "homepageContent",
    title: "Homepage",
    icon: Home,
    description: "Controls all the text and CTAs on your homepage.",
    appearsOn: ["Homepage — Hero Section, Testimonials Section, Featured Performances Section"],
    isSingleton: true,
    fields: [
      { field: "Hero Title", description: "Large heading in the hero area", type: "Text", required: true },
      { field: "Hero Subtitle", description: "Gold text below the title", type: "Text" },
      { field: "Hero Badge Text", description: "Small pill badge above the title (e.g., 'Professional Violinist')", type: "Text" },
      { field: "Hero Description", description: "Paragraph below subtitle", type: "Long Text" },
      { field: "Primary CTA Text", description: "Text on the gold button (e.g., 'Book Performance')", type: "Text" },
      { field: "Primary CTA Link", description: "Where the gold button goes (e.g., '/services')", type: "URL" },
      { field: "Secondary CTA Text", description: "Text on the outline button (e.g., 'View Performances')", type: "Text" },
      { field: "Secondary CTA Link", description: "Where the outline button goes (e.g., '/gallery')", type: "URL" },
      { field: "Featured Performances Title", description: "Heading for the songs section", type: "Text" },
      { field: "Featured Performances Description", description: "Description below the songs heading", type: "Long Text" },
      { field: "Testimonials Title", description: "Heading for the reviews section", type: "Text" },
      { field: "Testimonials Description", description: "Description below the reviews heading", type: "Long Text" },
    ],
  },
  {
    id: "aboutContent",
    title: "About Page",
    icon: User,
    description: "Your biography, stats, timeline, and philosophy on the About page.",
    appearsOn: ["About Page — Hero, Stats, Bio, Philosophy Section"],
    isSingleton: true,
    fields: [
      { field: "Hero Title", description: "Main heading on the about page", type: "Text" },
      { field: "Hero Subtitle", description: "Subtitle under the about heading", type: "Text" },
      { field: "Hero Image", description: "Your portrait photo on the about page", type: "Image" },
      { field: "Bio", description: "Rich text biography — supports bold, italic, links, and lists", type: "Rich Text" },
      { field: "Stats", description: "Key numbers (e.g., '20+ Years', '500+ Events') — each has a label and value", type: "Array of Objects" },
      { field: "Philosophy Title", description: "Heading for the philosophy section", type: "Text" },
      { field: "Philosophy", description: "Your musical philosophy text", type: "Long Text" },
    ],
  },
  {
    id: "galleryPhoto",
    title: "Gallery Photos",
    icon: ImageIcon,
    description: "Photos displayed in the Gallery page carousel.",
    appearsOn: ["Gallery Page — Photo Carousel"],
    fields: [
      { field: "Title", description: "Photo title (shown on hover)", type: "Text", required: true },
      { field: "Image", description: "The photo itself — supports hotspot cropping", type: "Image", required: true },
      { field: "Alt Text", description: "Accessibility description of the photo", type: "Text", required: true },
      { field: "Description", description: "Optional longer description", type: "Long Text" },
      { field: "Event Type", description: "Category: Wedding, Concert, Corporate, Private, Portrait, Other", type: "Dropdown" },
      { field: "Featured", description: "Toggle ON to show on homepage and featured sections", type: "Boolean" },
      { field: "Display Order", description: "Lower numbers appear first", type: "Number" },
    ],
  },
  {
    id: "video",
    title: "Videos",
    icon: Film,
    description: "Performance videos displayed on the Gallery page.",
    appearsOn: ["Gallery Page — Video Grid"],
    fields: [
      { field: "Title", description: "Video title", type: "Text", required: true },
      { field: "Mux Playback ID", description: "The Mux video ID for streaming — ask your developer if unsure", type: "Text", required: true },
      { field: "Description", description: "What the video shows", type: "Long Text" },
      { field: "Duration", description: "Video length (e.g., '3:45')", type: "Text" },
      { field: "Category", description: "Wedding, Concert, Corporate, Private, Lessons", type: "Dropdown" },
      { field: "Thumbnail Time", description: "Seconds into the video for the thumbnail preview", type: "Number" },
      { field: "Featured", description: "Show in featured sections", type: "Boolean" },
      { field: "Display Order", description: "Lower numbers appear first", type: "Number" },
    ],
  },
  {
    id: "song",
    title: "Song Repertoire",
    icon: Music,
    description: "Your complete song catalog shown on the Repertoire page.",
    appearsOn: ["Repertoire Page — Full Song Catalog", "Homepage — Featured Songs (if marked featured)"],
    fields: [
      { field: "Title", description: "Song name", type: "Text", required: true },
      { field: "Artist", description: "Original artist", type: "Text", required: true },
      { field: "Genre", description: "Classical, Pop, Rock, Jazz, R&B, Country, Musical Theatre, Film/TV, Religious, Traditional, Contemporary, Alternative", type: "Dropdown" },
      { field: "Category", description: "Grouping for display: Classical, Popular, Jazz, etc.", type: "Dropdown" },
      { field: "Duration", description: "Approximate performance length", type: "Text" },
      { field: "Description", description: "Notes about this arrangement", type: "Long Text" },
      { field: "Featured", description: "Show in the Featured Songs section on homepage", type: "Boolean" },
      { field: "Wedding Recommended", description: "Flag as recommended for weddings — appears in wedding song filter", type: "Boolean" },
    ],
  },
  {
    id: "testimonial",
    title: "Testimonials",
    icon: Star,
    description: "Client reviews displayed on the homepage.",
    appearsOn: ["Homepage — Split-Screen Testimonials", "Homepage — Client Reviews Carousel"],
    fields: [
      { field: "Author", description: "Client's name", type: "Text", required: true },
      { field: "Quote", description: "The review text", type: "Long Text", required: true },
      { field: "Event Type", description: "Wedding Ceremony, Reception, Corporate, Private, Concert, Lessons", type: "Dropdown" },
      { field: "Rating", description: "Star rating 1-5", type: "Number", required: true },
      { field: "Source", description: "Where the review came from: Google, Facebook, Wedding Wire, The Knot, Direct", type: "Dropdown" },
      { field: "Date", description: "When the review was written", type: "Date" },
      { field: "Featured", description: "Show in homepage testimonial sections", type: "Boolean" },
      { field: "Display Order", description: "Lower numbers appear first", type: "Number" },
    ],
  },
  {
    id: "service",
    title: "Services",
    icon: Briefcase,
    description: "Service offerings shown on the Services page.",
    appearsOn: ["Services Page — Comparison Chart"],
    fields: [
      { field: "Title", description: "Service name (e.g., 'Wedding Ceremony')", type: "Text", required: true },
      { field: "Slug", description: "URL-friendly name — auto-generated from title", type: "Slug" },
      { field: "Category", description: "Weddings, Private Events, or Violin Lessons", type: "Dropdown", required: true },
      { field: "Description", description: "What this service includes", type: "Long Text" },
      { field: "Icon", description: "Lucide icon name (e.g., 'Music', 'Heart')", type: "Text" },
      { field: "Items", description: "Bullet points of what's included", type: "String Array" },
      { field: "Price", description: "Starting price or 'Contact for quote'", type: "Text" },
      { field: "Featured", description: "Highlight this service", type: "Boolean" },
      { field: "Display Order", description: "Lower numbers appear first", type: "Number" },
    ],
  },
  {
    id: "timelineEvent",
    title: "Timeline Events",
    icon: Calendar,
    description: "Milestones displayed on the About page timeline.",
    appearsOn: ["About Page — Timeline Section"],
    fields: [
      { field: "Year", description: "When this happened (e.g., '2005')", type: "Text", required: true },
      { field: "Title", description: "Milestone title (e.g., 'First Public Performance')", type: "Text", required: true },
      { field: "Description", description: "What happened", type: "Long Text" },
      { field: "Age", description: "Your age at this milestone (optional)", type: "Text" },
      { field: "Icon", description: "Heart, Music, Award, GraduationCap, Users, Calendar, Star", type: "Dropdown" },
      { field: "Display Order", description: "Lower numbers appear first", type: "Number" },
    ],
  },
  {
    id: "faqItem",
    title: "FAQ Items",
    icon: HelpCircle,
    description: "Frequently asked questions on the Contact page.",
    appearsOn: ["Contact Page — FAQ Section"],
    fields: [
      { field: "Question", description: "The question visitors see", type: "Text", required: true },
      { field: "Answer", description: "Your answer", type: "Long Text", required: true },
      { field: "Category", description: "General, Booking & Events, Lessons, or Pricing", type: "Dropdown" },
      { field: "Display Order", description: "Lower numbers appear first", type: "Number" },
    ],
  },
]

// ═══════════════════════════════════════════════════════
// Expandable Section Component
// ═══════════════════════════════════════════════════════

function ContentSectionCard({ section }: { section: ContentSection }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = section.icon

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50 hover:bg-card/80 transition-colors">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-foreground">{section.title}</h3>
            {section.isSingleton && (
              <span className="text-[10px] uppercase tracking-wider bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">
                Single Page
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{section.description}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Where it appears */}
              <div className="flex flex-wrap gap-2">
                {section.appearsOn.map((page) => (
                  <span
                    key={page}
                    className="inline-flex items-center gap-1.5 text-xs bg-gold/10 text-gold px-2.5 py-1 rounded-full"
                  >
                    <Globe className="w-3 h-3" />
                    {page}
                  </span>
                ))}
              </div>

              {/* Fields table */}
              <div className="rounded-lg border border-border/30 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/30">
                      <th className="text-left p-3 font-medium text-muted-foreground">Field</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Type</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Where It Shows</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {section.fields.map((f) => (
                      <tr key={f.field} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <span className="font-medium text-foreground">{f.field}</span>
                          {f.required && (
                            <span className="text-red-400 ml-1" title="Required">*</span>
                          )}
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <span className="text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">
                            {f.type}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// Quick Actions
// ═══════════════════════════════════════════════════════

const quickLinks = [
  { label: "View Website", href: "/", icon: Globe, description: "See live site" },
  { label: "Booking Page", href: "/booking", icon: Calendar, description: "Test booking flow" },
  { label: "Services", href: "/services", icon: Briefcase, description: "View services" },
  { label: "Contact", href: "/contact", icon: Layout, description: "View contact page" },
]

// ═══════════════════════════════════════════════════════
// Admin Dashboard Page
// ═══════════════════════════════════════════════════════

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background dark:bg-black">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Content reference guide for your website</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-gold" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-gold/30 transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                  <link.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-medium text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="rounded-xl border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent p-6">
          <h2 className="font-serif text-lg font-bold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            Content Reference Guide
          </h2>
          <p className="text-sm text-muted-foreground">
            This page documents all the content sections on your website, including which fields exist and where they appear.
            To update content, edit the relevant component files in the codebase or contact your developer.
          </p>
        </section>

        {/* Content Sections Documentation */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-gold" />
            Content Sections &amp; Fields
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click any section to see all editable fields and where they appear on your website.
            Fields marked with <span className="text-red-400">*</span> are required.
          </p>
          <div className="space-y-3">
            {contentSections.map((section) => (
              <ContentSectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        {/* Page Map */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-gold" />
            Page-by-Page Content Map
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                page: "Homepage",
                route: "/",
                sources: ["Site Settings (hero)", "Homepage Content (CTAs, headings)", "Testimonials", "Songs (featured)"],
              },
              {
                page: "About",
                route: "/about",
                sources: ["About Page Content (bio, stats, philosophy)", "Timeline Events"],
              },
              {
                page: "Gallery",
                route: "/gallery",
                sources: ["Gallery Photos", "Videos"],
              },
              {
                page: "Repertoire",
                route: "/repertoire",
                sources: ["Song Repertoire (all songs)"],
              },
              {
                page: "Services",
                route: "/services",
                sources: ["Services"],
              },
              {
                page: "Contact",
                route: "/contact",
                sources: ["Site Settings (email, phone, location)", "FAQ Items"],
              },
            ].map((item) => (
              <div
                key={item.page}
                className="rounded-xl border border-border/50 bg-card/30 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif font-bold">{item.page}</h3>
                  <Link
                    href={item.route}
                    className="text-xs text-gold hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Content pulled from:</p>
                <ul className="space-y-1">
                  {item.sources.map((source) => (
                    <li key={source} className="text-sm text-foreground/80 flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="text-center py-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Need help updating content? Contact your developer.
          </p>
        </section>
      </div>
    </div>
  )
}
