"use client"

import { AnimatedElement } from "@/components/animated-element"
import { StaggeredContainer, StaggeredItem } from "@/components/staggered-container"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Music, GraduationCap, Award, Users, Heart } from "lucide-react"

const timelineEvents = [
  {
    year: "1999",
    title: "Born",
    description: "Allan Palmer was born, beginning a journey that would lead to musical excellence.",
    icon: Heart,
    age: "Birth",
  },
  {
    year: "2006",
    title: "Musical Journey Begins",
    description: "At age 7, Allan picked up his first violin and discovered his passion for music.",
    icon: Music,
    age: "Age 7",
  },
  {
    year: "2008",
    title: "First Public Performance",
    description: "Allan's first public performance marked the beginning of his performance career.",
    icon: Award,
    age: "Age 9",
  },
  {
    year: "2011",
    title: "Advanced Training",
    description: "Began intensive classical training and advanced technique development.",
    icon: GraduationCap,
    age: "Age 12",
  },
  {
    year: "2015",
    title: "Teaching Career Began",
    description: "At age 16, started sharing his passion for music by teaching violin to aspiring musicians.",
    icon: Users,
    age: "Age 16",
  },
  {
    year: "2017",
    title: "Started Performing at Weddings",
    description: "Expanded into professional wedding and event performances across the region.",
    icon: Calendar,
    age: "Age 18",
  },
  {
    year: "2021",
    title: "Established as an Artist",
    description: "Now recognized as a premier violinist for weddings, ceremonies, and special events.",
    icon: Award,
    age: "Age 22",
  },
]

export function AboutTimeline() {
  return (
    <section className="py-16 md:py-24 bg-background dark:bg-black">
      <div className="container">
        <AnimatedElement variant="fade-up" className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl mb-4">Musical Journey</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From early beginnings to becoming a celebrated violinist, Allan's path has been marked by dedication,
            passion, and countless memorable performances.
          </p>
        </AnimatedElement>

        <StaggeredContainer className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gold/30 dark:bg-gold/20 transform md:-translate-x-0.5" />

          {timelineEvents.map((event, index) => {
            const IconComponent = event.icon
            const isEven = index % 2 === 0

            return (
              <StaggeredItem key={event.year}>
                <div className={`relative flex items-center mb-12 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-5 h-5 bg-gold rounded-full border-4 border-background dark:border-black shadow-lg shadow-gold/20 transform md:-translate-x-2.5 z-20" />

                  {/* Content card */}
                  <div className={`flex-1 ml-16 md:ml-0 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                    <Card className="relative z-10 group hover:shadow-2xl hover:shadow-gold/5 transition-all duration-300 border-2 border-gold/20 bg-white dark:bg-black hover:border-gold/40">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gold/10 dark:bg-gold/15 rounded-full flex items-center justify-center group-hover:bg-gold/20 dark:group-hover:bg-gold/25 transition-colors duration-300 border border-gold/20">
                            <IconComponent className="w-6 h-6 text-gold" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl font-bold text-gold">{event.year}</span>
                              <span className="text-xs font-medium text-foreground/70 dark:text-foreground/60 bg-gold/10 dark:bg-gold/20 px-3 py-1 rounded-full border border-gold/20">
                                {event.age}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground dark:text-white group-hover:text-gold transition-colors duration-300">
                              {event.title}
                            </h3>
                            <p className="text-foreground/70 dark:text-foreground/80 leading-relaxed">{event.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </StaggeredItem>
            )
          })}
        </StaggeredContainer>

        <AnimatedElement variant="fade-up" className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-gold/10 rounded-full text-primary dark:text-gold font-medium">
            <Music className="w-4 h-4" />
            <span>The journey continues...</span>
          </div>
        </AnimatedElement>
      </div>
    </section>
  )
}
