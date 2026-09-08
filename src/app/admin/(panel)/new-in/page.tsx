import Image from "next/image";
import { deleteNewInItem } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/FormBits";
import { NewInForm } from "@/components/admin/NewInForm";
import { SortableList } from "@/components/admin/SortableList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewInPage() {
  const [items, brands] = await Promise.all([
    prisma.newInItem
      .findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { brand: { select: { name: true } } },
      })
      .catch(() => []),
    prisma.brand
      .findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } })
      .catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">New In</h2>
        <p className="mt-1 text-sm text-slate-600">
          Newest pieces first. Tick &ldquo;Feature on the home page&rdquo; to show a piece in the
          home page strip.
        </p>
      </section>

      {brands.length === 0 && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          There are no brands yet, so the brand dropdown will be empty. Add brands first if you want
          to label pieces.
        </p>
      )}

      <details className="admin-card" open={items.length === 0}>
        <summary className="cursor-pointer text-sm font-semibold">+ Add a piece</summary>
        <div className="mt-4">
          <NewInForm brands={brands} />
        </div>
      </details>

      <SortableList
        kind="newIn"
        emptyMessage="Nothing in New In yet. Add the first piece above."
        items={items.map((item) => ({
          id: item.id,
          content: (
            <div>
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {item.title}
                    {item.featured && (
                      <span className="ml-2 inline-block whitespace-nowrap rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
                        On home page
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {[item.brand?.name, item.price].filter(Boolean).join(" · ") || "—"}
                  </p>
                  {item.note && <p className="mt-0.5 text-sm text-slate-500">{item.note}</p>}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <form action={deleteNewInItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <DeleteButton confirm={`Delete “${item.title}” from New In?`} />
                </form>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold">Edit</summary>
                <div className="mt-4">
                  <NewInForm
                    brands={brands}
                    item={{
                      id: item.id,
                      title: item.title,
                      brandId: item.brandId,
                      imageUrl: item.imageUrl,
                      imageAlt: item.imageAlt,
                      price: item.price,
                      note: item.note,
                      featured: item.featured,
                    }}
                  />
                </div>
              </details>
            </div>
          ),
        }))}
      />
    </div>
  );
}
