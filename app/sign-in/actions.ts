"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type SignInState =
  | { status: "idle" }
  | { status: "error"; message: string };

/**
 * Unified sign-in / auto-register action.
 *
 * - Unknown email + valid password → create account, sign in.
 * - Known email + correct password → sign in.
 * - Known email + wrong password → error. Account is NOT overwritten.
 */
export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return {
      status: "error",
      message: "Password must be at least 6 characters.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return { status: "idle" };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message:
          error.type === "CredentialsSignin"
            ? "That email is already registered and the password doesn't match."
            : "Sign-in failed. Please try again.",
      };
    }
    throw error;
  }
}
