/**
 * Minimal .env loader so `npm run seed` and `npm run hash` see the same
 * variables Next.js does, without pulling in a dependency.
 * Later files do not overwrite variables already set in the shell.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

for (const file of [".env.local", ".env"]) {
  const full = path.join(process.cwd(), file);
  if (!existsSync(full)) continue;

  for (const rawLine of readFileSync(full, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim().replace(/^export\s+/, "");
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Next.js expands $VAR references in .env, so values that contain literal
    // dollar signs (a bcrypt hash, say) are written escaped as \$. Undo that
    // here so scripts see exactly what the app sees.
    value = value.replace(/\\\$/g, "$");

    if (process.env[key] === undefined) process.env[key] = value;
  }
}
