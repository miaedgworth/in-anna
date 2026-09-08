import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settingDefinitions, type Settings } from "@/lib/setting-definitions";

export { settingDefinitions };
export type { SettingKey, Settings } from "@/lib/setting-definitions";

const fallbacks = Object.fromEntries(
  settingDefinitions.map((d) => [d.key, d.fallback]),
) as Settings;

async function loadSettings(): Promise<Settings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const stored = new Map(rows.map((r) => [r.key, r.value]));
    return Object.fromEntries(
      settingDefinitions.map((d) => {
        const value = stored.get(d.key);
        return [d.key, value === undefined || value === "" ? d.fallback : value];
      }),
    ) as Settings;
  } catch (error) {
    // The site should still render if the database is briefly unreachable.
    console.error("[settings] falling back to defaults:", error);
    return { ...fallbacks };
  }
}

/** Cached for the public site; revalidated whenever settings are saved. */
export const getSettings = unstable_cache(loadSettings, ["site-settings"], {
  tags: ["site-settings"],
  revalidate: 300,
});

/** Uncached read, for the admin form. */
export async function getSettingsFresh(): Promise<Settings> {
  return loadSettings();
}
