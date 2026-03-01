import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Allan Palmer | Professional Violinist",
  description:
    "Book Allan Palmer for your wedding, corporate event, or private function. Fill out a quick form and Allan will be in touch within 24 hours.",
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
