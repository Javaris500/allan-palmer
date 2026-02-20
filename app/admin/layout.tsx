import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin Dashboard | Allan Palmer",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/")
  }

  return <>{children}</>
}
