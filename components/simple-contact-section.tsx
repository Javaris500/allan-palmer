"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, MessageSquare, Calendar } from "lucide-react"
import { AnimatedElement } from "@/components/animated-element"
import { CONTACT_INFO } from "@/lib/constants"

export function SimpleContactSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-muted/30 to-background">
      <div className="container">
        <AnimatedElement variant="fade-up" className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Get in Touch with Allan
          </h2>
          <p className="mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Ready to add beautiful violin music to your special event? Contact Allan directly to discuss your needs and
            get a personalized quote.
          </p>
        </AnimatedElement>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Primary Contact Card */}
          <AnimatedElement variant="fade-up" delay={0.1}>
            <Card className="h-full border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Contact Allan Directly</CardTitle>
                <CardDescription className="text-base">
                  Get in touch for bookings, questions, or lesson inquiries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button asChild size="default" className="w-full md:h-12 h-14 text-base font-medium">
                    <a
                      href={`mailto:${CONTACT_INFO.email}?subject=Booking Inquiry&body=Hi Allan,%0D%0A%0D%0AI'm interested in booking you for my event. Here are the details:%0D%0A%0D%0AEvent Type: %0D%0ADate: %0D%0ATime: %0D%0ALocation: %0D%0ANumber of Guests: %0D%0A%0D%0APlease let me know your availability and pricing.%0D%0A%0D%0AThank you!`}
                      className="flex items-center gap-3"
                    >
                      <Mail className="h-5 w-5" />
                      Send Email
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="default"
                    className="w-full md:h-12 h-14 text-base font-medium bg-transparent"
                  >
                    <a href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`} className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      Call {CONTACT_INFO.phone}
                    </a>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Serving {CONTACT_INFO.location} & surrounding areas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>

          {/* Quick Contact Info */}
          <AnimatedElement variant="fade-up" delay={0.2}>
            <Card className="h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Quick Contact Info</CardTitle>
                <CardDescription className="text-base">All the ways to reach Allan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">Email</p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">Phone</p>
                      <a
                        href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">Location</p>
                      <p className="text-sm text-muted-foreground">{CONTACT_INFO.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-3">Perfect for:</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Wedding ceremonies & receptions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Corporate events & galas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Private parties & celebrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Violin lessons (all levels)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>
        </div>

        {/* Additional Info */}
        <AnimatedElement variant="fade-up" delay={0.3} className="mt-12">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Ready to Book?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                When contacting Allan, please include your event date, location, duration, and any special requests.
                This helps him provide you with the most accurate quote and availability.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Professional & reliable
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Extensive repertoire
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Competitive pricing
                </span>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>
    </section>
  )
}
