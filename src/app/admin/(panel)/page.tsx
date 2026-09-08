import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { blobConfigured } from "@/lib/uploads";

async function counts() {
  try {
    const [brands, hiddenBrands, items, featured, gallery] = await Promise.all([
      prisma.brand.count(),
      prisma.brand.count({ where: { visible: false } }),
      prisma.newInItem.count(),
      prisma.newInItem.count({ where: { featured: true } }),
      prisma.galleryImage.count(),
    ]);
    return { brands, hiddenBrands, items, featured, gallery, error: false };
  } catch {
    return { brands: 0, hiddenBrands: 0, items: 0, featured: 0, gallery: 0, error: true };
  }
}

export default async function AdminDashboard() {
  const data = await counts();

  const cards = [
    {
      href: "/admin/new-in",
      title: "New In",
      body: `${data.items} ${data.items === 1 ? "piece" : "pieces"}, ${data.featured} featured on the home page`,
      cta: "Add or edit arrivals",
    },
    {
      href: "/admin/brands",
      title: "Brands",
      body: `${data.brands} ${data.brands === 1 ? "brand" : "brands"}${
        data.hiddenBrands > 0 ? `, ${data.hiddenBrands} hidden` : ""
      }`,
      cta: "Add or edit brands",
    },
    {
      href: "/admin/gallery",
      title: "Gallery",
      body: `${data.gallery} ${data.gallery === 1 ? "photograph" : "photographs"}`,
      cta: "Upload photographs",
    },
    {
      href: "/admin/settings",
      title: "Site settings",
      body: "Tagline, introduction, opening hours text and social links",
      cta: "Edit site text",
    },
  ];

  return (
    <div>
      {data.error && (
        <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          The database could not be reached. Check <code>DATABASE_URL</code> and try again.
        </p>
      )}

      {!blobConfigured() && process.env.NODE_ENV === "production" && (
        <p role="alert" className="mb-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Image uploads are not configured. Add <code>BLOB_READ_WRITE_TOKEN</code> to the
          environment so photographs can be saved.
        </p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <li key={card.href}>
            <Link href={card.href} className="admin-card block h-full hover:border-slate-400">
              <h2 className="text-base font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{card.body}</p>
              <p className="mt-3 text-sm font-medium text-slate-900">{card.cta} →</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="admin-card mt-6">
        <h2 className="text-base font-semibold">A few notes</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>Photos are shrunk automatically before uploading — shoot straight from your phone.</li>
          <li>
            Tick <strong>Feature on home page</strong> on a New In piece to put it in the strip on
            the home page.
          </li>
          <li>Drag a row, or use the ↑ / ↓ buttons, to change the order things appear in.</li>
          <li>Changes go live on the site within a few seconds.</li>
        </ul>
      </div>
    </div>
  );
}
