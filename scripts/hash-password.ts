/**
 * Generates the bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 *   npm run hash -- "the-password"
 *
 * Two forms are printed. Hosting dashboards (Vercel, etc.) take the value
 * literally, so paste the plain hash there. A local .env file is read by
 * dotenv-expand, which treats `$2b` as a variable and quietly eats it — so the
 * dollar signs have to be escaped there.
 */
import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error('Usage: npm run hash -- "your-password"');
    process.exit(1);
  }

  if (password.length < 10) {
    console.warn("⚠  That password is short. Ten characters or more is a good idea.\n");
  }

  const hash = await bcrypt.hash(password, 12);

  console.log("\nFor Vercel (and any other hosting dashboard) — paste exactly:\n");
  console.log(`  ${hash}\n`);
  console.log("For a local .env file — the dollar signs must be escaped:\n");
  console.log(`  ADMIN_PASSWORD_HASH="${hash.replace(/\$/g, "\\$")}"\n`);
}

main();
