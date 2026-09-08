/**
 * Seeds the database so a fresh install has something to look at:
 *  - the admin account, from ADMIN_EMAIL / ADMIN_PASSWORD_HASH
 *  - six clearly-labelled placeholder brands
 *  - the shop interior photograph in the gallery
 *  - the default site copy
 *
 * Safe to run more than once: everything is upserted or skipped if present.
 */
import "./load-env";
import { PrismaClient } from "@prisma/client";
import { settingDefinitions } from "../src/lib/setting-definitions";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const PLACEHOLDER_NOTE = "Placeholder brand — replace in admin";

const placeholderBrands = [
  {
    name: "Maison Lumen",
    description: `${PLACEHOLDER_NOTE}. Softly tailored separates in linen and washed cotton, made in small runs.`,
  },
  {
    name: "Atelier Sorrel",
    description: `${PLACEHOLDER_NOTE}. Knitwear in undyed wool and alpaca, cut generously and meant to last.`,
  },
  {
    name: "Verdi & Wren",
    description: `${PLACEHOLDER_NOTE}. Everyday dresses with a good drape, in prints drawn by hand.`,
  },
  {
    name: "Harbour House",
    description: `${PLACEHOLDER_NOTE}. Coats and outerwear built for a wet island winter.`,
  },
  {
    name: "Sable Studio",
    description: `${PLACEHOLDER_NOTE}. Leather bags and small accessories, finished by hand.`,
  },
  {
    name: "Clove & Ash",
    description: `${PLACEHOLDER_NOTE}. Quiet jewellery in recycled silver and gold vermeil.`,
  },
];

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (!email || !passwordHash) {
    console.warn(
      "→ Skipping the admin account: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH first.\n" +
        '  Generate a hash with: npm run hash -- "your-password"',
    );
    return;
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Inanna" },
  });
  console.log(`→ Admin account ready: ${email}`);
}

async function seedBrands() {
  const existing = await prisma.brand.count();
  if (existing > 0) {
    console.log(`→ Brands: ${existing} already present, leaving them alone.`);
    return;
  }

  await prisma.brand.createMany({
    data: placeholderBrands.map((brand, index) => ({
      name: brand.name,
      slug: slugify(brand.name),
      description: brand.description,
      sortOrder: index,
      visible: true,
    })),
  });
  console.log(`→ Brands: added ${placeholderBrands.length} placeholders.`);
}

async function seedGallery() {
  const existing = await prisma.galleryImage.count();
  if (existing > 0) {
    console.log(`→ Gallery: ${existing} photograph(s) already present, leaving them alone.`);
    return;
  }

  await prisma.galleryImage.create({
    data: {
      imageUrl: "/brand/interior.jpg",
      caption: "Inside the shop on Le Pollet",
      imageAlt:
        "Rails of womenswear beneath pleated paper pendant lights in the Inanna shop interior",
      sortOrder: 0,
    },
  });
  console.log("→ Gallery: added the shop interior photograph.");
}

async function seedSettings() {
  const rows = settingDefinitions.map((definition) => ({
    key: definition.key,
    value: definition.fallback,
  }));

  await prisma.$transaction(
    rows.map((row) =>
      prisma.siteSetting.upsert({
        where: { key: row.key },
        update: {}, // never overwrite wording the owner has already changed
        create: row,
      }),
    ),
  );
  console.log(`→ Site settings: ${rows.length} keys ready.`);
}

async function main() {
  await seedAdmin();
  await seedBrands();
  await seedGallery();
  await seedSettings();
  console.log("\nDone.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
