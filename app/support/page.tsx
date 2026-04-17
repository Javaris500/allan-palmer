import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { DonatePage } from "./donate-page";

export const metadata: Metadata = {
  title: "Support Allan — Winnipeg Violinist",
  description:
    "Keep Allan Palmer's music free and evolving. One-time gifts and monthly patronage support recordings, student scholarships, and the continuing study of the violin.",
  openGraph: {
    title: "Support Allan — Winnipeg Violinist",
    description:
      "Keep Allan Palmer's music free and evolving. One-time gifts and monthly patronage.",
    type: "website",
  },
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <PageTransition>
      <DonatePage />
    </PageTransition>
  );
}
