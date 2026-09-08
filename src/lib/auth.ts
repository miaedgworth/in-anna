import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * There is exactly one account: the shop owner's. The email and bcrypt hash
 * come from ADMIN_EMAIL / ADMIN_PASSWORD_HASH; if those are not set we fall
 * back to the AdminUser row written by `npm run seed`.
 */
const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

async function findAdmin(email: string): Promise<{ email: string; passwordHash: string } | null> {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (envEmail && envHash && envEmail === email) {
    if (!BCRYPT_HASH.test(envHash)) {
      // Almost always a .env file: dotenv-expand reads `$2b` as a variable and
      // strips it. Escape the dollar signs (\$2b\$12\$…) or set the value in
      // the hosting dashboard, where no expansion happens.
      console.error(
        "[auth] ADMIN_PASSWORD_HASH is not a valid bcrypt hash. If it is set in a .env " +
          "file, escape every $ as \\$ — run `npm run hash -- \"your-password\"` for the " +
          "correctly escaped line.",
      );
      return null;
    }
    return { email: envEmail, passwordHash: envHash };
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    return user ? { email: user.email, passwordHash: user.passwordHash } : null;
  } catch {
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.trim().toLowerCase();
        const admin = await findAdmin(email);

        // Hash a dummy value when the account is unknown so that a wrong email
        // and a wrong password take about the same time to reject.
        const hash = admin?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
        const ok = await bcrypt.compare(parsed.data.password, hash);

        if (!admin || !ok) return null;
        return { id: admin.email, email: admin.email, name: "Inanna" };
      },
    }),
  ],
});

/** Throws if there is no signed-in admin. Use at the top of every mutation. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Not authorised.");
  return session.user;
}
