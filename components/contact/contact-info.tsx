"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { CONTACT_INFO } from "@/lib/constants"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact Information
          </CardTitle>
          <CardDescription>Get in touch with Allan directly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{CONTACT_INFO.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{CONTACT_INFO.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{CONTACT_INFO.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Response Time</p>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Need something specific?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" className="w-full md:h-10 h-12 justify-start bg-transparent">
            <a href={`tel:+1${CONTACT_INFO.phone.replace(/\D/g, "")}`} className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Allan
            </a>
          </Button>
          <Button asChild variant="outline" className="w-full md:h-10 h-12 justify-start bg-transparent">
            <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Booking Inquiries</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For faster booking processing, consider using our dedicated booking form which includes all the details
            Allan needs to provide you with an accurate quote.
          </p>
          <Button asChild className="w-full md:h-10 h-12">
            <a href="/services">Use Booking Form</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
