// ═══════════════════════════════════════════════════════════════════════════
// Dev-mode auth bypass
// ═══════════════════════════════════════════════════════════════════════════
// In development, we provide a mock session so you can build and test
// the booking experience without needing to sign in every time.
// In production, this always returns null (forcing real auth).

export interface MockSession {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function getDevSession(): MockSession | null {
  if (process.env.NODE_ENV !== "development") return null

  return {
    user: {
      id: "dev-user-001",
      name: "Dev User",
      email: "dev@localhost.test",
      role: "STUDENT",
    },
  }
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development"
}
