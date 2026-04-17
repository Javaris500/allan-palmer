import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

// Auto-register semantics: if the email is unknown, create a USER with the
// supplied password. If the email exists, verify the bcrypt hash. Wrong
// password on an existing account does NOT overwrite — it fails.
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as never) as Adapter,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
          // Existing account — verify password.
          if (!existing.hashedPassword) return null;
          const valid = await bcrypt.compare(
            parsed.data.password,
            existing.hashedPassword,
          );
          if (!valid) return null;
          return {
            id: existing.id,
            email: existing.email!,
            name: existing.name,
            image: existing.image,
            role: existing.role,
          };
        }

        // New account — create with hashed password and default USER role.
        const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
        const created = await prisma.user.create({
          data: {
            email,
            hashedPassword,
            role: "USER",
            emailVerified: new Date(),
          },
        });
        return {
          id: created.id,
          email: created.email!,
          name: created.name,
          image: created.image,
          role: created.role,
        };
      },
    }),
  ],
});
