import Image from "next/image";
import { deleteBrand, toggleBrandVisible } from "@/app/admin/actions";
import { BrandForm } from "@/components/admin/BrandForm";
import { DeleteButton } from "@/components/admin/FormBits";
import { SortableList } from "@/components/admin/SortableList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand
    .findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
    .catch(() => []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Brands</h2>
        <p className="mt-1 text-sm text-slate-600">
          These appear on the Brands page and in the logo row on the home page, in this order.
        </p>
      </section>

      <details className="admin-card">
        <summary className="cursor-pointer text-sm font-semibold">+ Add a brand</summary>
        <div className="mt-4">
          <BrandForm />
        </div>
      </details>

      <SortableList
        kind="brand"
        emptyMessage="No brands yet. Add the first one above."
        items={brands.map((brand) => ({
          id: brand.id,
          content: (
            <div>
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {brand.imageUrl ? (
                    <Image
                      src={brand.imageUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-slate-400">
                      No logo
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {brand.name}
                    {!brand.visible && (
                      <span className="ml-2 inline-block whitespace-nowrap rounded bg-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
                        Hidden
                      </span>
                    )}
                  </p>
                  {brand.description && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{brand.description}</p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <form action={toggleBrandVisible}>
                  <input type="hidden" name="id" value={brand.id} />
                  <button type="submit" className="admin-button-secondary">
                    {brand.visible ? "Hide" : "Show"}
                  </button>
                </form>
                <form action={deleteBrand}>
                  <input type="hidden" name="id" value={brand.id} />
                  <DeleteButton
                    confirm={`Delete “${brand.name}”? New In pieces keep their photo but lose the brand label.`}
                  />
                </form>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold">Edit</summary>
                <div className="mt-4">
                  <BrandForm
                    brand={{
                      id: brand.id,
                      name: brand.name,
                      description: brand.description,
                      imageUrl: brand.imageUrl,
                      imageAlt: brand.imageAlt,
                      websiteUrl: brand.websiteUrl,
                      visible: brand.visible,
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
