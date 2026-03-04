import type { Metadata } from "next"
import Link from "next/link"
import { Music, ArrowLeft, GraduationCap, Users, Globe, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Violin Lessons | Allan Palmer",
  description:
    "Private violin lessons with Allan Palmer — coming soon to Winnipeg, Manitoba. Stay tuned for lesson packages, scheduling, and more.",
  openGraph: {
    title: "Violin Lessons | Allan Palmer",
    description:
      "Private violin lessons with Allan Palmer — coming soon to Winnipeg, Manitoba.",
    type: "website",
  },
  alternates: {
    canonical: "/lessons",
  },
}

const upcomingOfferings = [
  {
    icon: GraduationCap,
    title: "Private Lessons",
    description: "One-on-one instruction tailored to your skill level and goals.",
  },
  {
    icon: Users,
    title: "Group Sessions",
    description: "Learn alongside others in an encouraging, collaborative setting.",
  },
  {
    icon: Globe,
    title: "Online Lessons",
    description: "Connect with Allan from anywhere via live video sessions.",
  },
]

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          Coming Soon
        </div>

        {/* Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-150" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 backdrop-blur-sm">
            <Music className="h-12 w-12 text-gold" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 tracking-tight">
          Violin Lessons
        </h1>
        <p className="text-xl sm:text-2xl text-gold font-serif mb-6 text-center">
          with Allan Palmer
        </p>

        {/* Description */}
        <p className="text-muted-foreground max-w-lg text-center text-lg leading-relaxed mb-12">
          Allan is crafting a world-class lesson experience for violinists of every level — 
          from first-time players to advanced musicians looking to refine their craft.
        </p>

        {/* Offering Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-12">
          {upcomingOfferings.map((offering) => (
            <div
              key={offering.title}
              className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center hover:border-gold/30 hover:bg-card/80 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                <offering.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{offering.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {offering.description}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8 max-w-xs w-full">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Stay Tuned</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-gold text-gray-950 font-semibold px-8 py-3 rounded-full text-sm hover:bg-gold/90 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-gold/20"
          >
            Get Notified
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-muted/50 text-foreground font-medium px-8 py-3 rounded-full text-sm hover:bg-muted/80 transition-all duration-200 active:scale-[0.98] border border-border/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
