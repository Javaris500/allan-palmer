import { auth } from "@/auth";
import { LeahDock } from "./LeahDock";

/**
 * Server-side wrapper that reads the session and hands minimal props to the
 * client dock. Mounted once in the root layout — visible site-wide.
 */
export async function LeahMount() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";
  const userName = session?.user?.name ?? null;

  return (
    <LeahDock isLoggedIn={isLoggedIn} isAdmin={isAdmin} userName={userName} />
  );
}
