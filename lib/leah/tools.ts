import type { Session } from "next-auth";
import type { LeahMode } from "@/generated/prisma";
import { customerTools } from "./tools/customer";
import { adminTools } from "./tools/admin";

/**
 * Returns the tool set allowed for a given mode.
 * Strict server-side gating: admin tools never appear in the customer set.
 * A jailbroken customer Leah cannot invoke admin tools because they aren't in her registry.
 */
export function getToolsForMode(session: Session | null, mode: LeahMode) {
  return mode === "ADMIN" ? adminTools(session) : customerTools(session);
}
