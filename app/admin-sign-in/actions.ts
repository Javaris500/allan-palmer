"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AdminSignInState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function adminSignInAction(
  _prev: AdminSignInState,
  formData: FormData,
): Promise<AdminSignInState> {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!adminEmail) {
    return {
      status: "error",
      message: "Admin portal is not configured on this environment.",
    };
  }

  const passcode = String(formData.get("passcode") ?? "");
  if (passcode.length < 6) {
    return {
      status: "error",
      message: "Passcode must be at least 6 characters.",
    };
  }

  const rawCallback = String(formData.get("callbackUrl") ?? "/admin");
  const callbackUrl = rawCallback.startsWith("/admin") ? rawCallback : "/admin";

  // Defense in depth: this endpoint is only for an ADMIN account. If the
  // configured email isn't an ADMIN row, refuse before hitting signIn so we
  // don't even compare hashes for non-admin users.
  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
    select: { role: true },
  });
  if (!user || user.role !== "ADMIN") {
    return {
      status: "error",
      message: "Admin portal is not available.",
    };
  }

  try {
    await signIn("credentials", {
      email: adminEmail,
      password: passcode,
      redirectTo: callbackUrl,
    });
    return { status: "idle" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { status: "error", message: "Incorrect passcode." };
    }
    throw error;
  }
}
