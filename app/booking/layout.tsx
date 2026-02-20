import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Allan Palmer | Professional Violinist",
  description:
    "Book Allan Palmer for your wedding, corporate event, or private function. Guided booking experience with Leia, our booking assistant.",
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
