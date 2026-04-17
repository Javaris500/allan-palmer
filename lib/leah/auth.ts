import { auth } from "@/auth";
import type { Session } from "next-auth";
import type { LeahMode } from "@/generated/prisma";

export async function getLeahSession(): Promise<Session | null> {
  return await auth();
}

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

export function getMode(session: Session | null): LeahMode {
  return isAdmin(session) ? "ADMIN" : "CUSTOMER";
}

export class UnauthorizedError extends Error {
  constructor(msg = "Sign in to chat with Leah.") {
    super(msg);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(msg = "You don't have permission to use this tool.") {
    super(msg);
    this.name = "ForbiddenError";
  }
}

export function requireUser(session: Session | null) {
  if (!session?.user?.id) throw new UnauthorizedError();
  return session.user;
}

export function requireAdmin(session: Session | null) {
  const user = requireUser(session);
  if (user.role !== "ADMIN") throw new ForbiddenError();
  return user;
}
