import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Allan Palmer",
  robots: { index: false, follow: false },
};

// Sign-out form posts to a server action that calls next-auth's signOut and
// then bounces back to the admin sign-in page. Allan was reporting "delete
// doesn't work" and one likely cause is a stale 7-day JWT — without a
// sign-out button he had no way to refresh the session on the same device.
async function adminSignOut() {
  "use server";
  await signOut({ redirectTo: "/admin-sign-in" });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=%2Fadmin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/sign-in?callbackUrl=%2Fadmin&error=admin_only");
  }

  return (
    <>
      <div className="fixed top-3 right-3 z-50">
        <form action={adminSignOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors"
            aria-label="Sign out of admin"
            title={`Signed in as ${session.user.email}`}
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </form>
      </div>
      {children}
    </>
  );
}
