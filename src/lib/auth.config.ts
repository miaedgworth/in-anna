import type { NextAuthConfig } from "next-auth";

/**
 * The half of the auth configuration that is safe to run in middleware:
 * no database access, no password hashing. `src/lib/auth.ts` extends it with
 * the credentials provider.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    session({ session, token }) {
      if (token?.email) session.user.email = token.email;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
