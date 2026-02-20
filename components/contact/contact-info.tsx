"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, MessageSquare, Calendar } from "lucide-react"
import { CONTACT_INFO } from "@/lib/constants"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-gold/20 bg-background dark:bg-black hover:border-gold/40 transition-all shadow-lg shadow-gold/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold">
            <MessageSquare className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Get in touch with Allan directly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold/5 transition-colors group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Email</p>
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold/5 transition-colors group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Phone</p>
              <a href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold/5 transition-colors group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Location</p>
              <p className="text-sm text-muted-foreground">{CONTACT_INFO.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold/5 transition-colors group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
              <Clock className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Response Time</p>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-gold/20 bg-background dark:bg-black hover:border-gold/40 transition-all shadow-lg shadow-gold/5">
        <CardHeader>
          <CardTitle className="text-gold">Quick Actions</CardTitle>
          <CardDescription>Prefer direct contact?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full h-12 justify-start bg-transparent border-gold/30 hover:border-gold hover:bg-gold/5">
            <a href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`} className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gold" />
              <span>Call Allan</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 justify-start bg-transparent border-gold/30 hover:border-gold hover:bg-gold/5">
            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gold" />
              <span>Send Email</span>
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 dark:from-gold/10 dark:to-gold/5 shadow-lg shadow-gold/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="h-5 w-5 text-gold mt-0.5" />
            <div>
              <h3 className="font-bold text-gold mb-1">Booking Inquiries</h3>
              <p className="text-sm text-foreground/80 dark:text-foreground/90">
                For faster booking processing, use our dedicated booking form which includes all the details Allan needs to provide you with an accurate quote.
              </p>
            </div>
          </div>
          <Button asChild className="w-full h-12 bg-gold hover:bg-gold/90 text-black font-semibold shadow-lg">
            <a href="/services">Use Booking Form</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
