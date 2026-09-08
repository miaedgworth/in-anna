import Image from "next/image";
import { deleteGalleryImage } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/FormBits";
import { GalleryEditForm, GalleryUploadForm } from "@/components/admin/GalleryForm";
import { SortableList } from "@/components/admin/SortableList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage
    .findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
    .catch(() => []);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Gallery</h2>
        <p className="mt-1 text-sm text-slate-600">
          Photographs of the shop and the stock, shown in this order on the Gallery page.
        </p>
      </section>

      <details className="admin-card" open={images.length === 0}>
        <summary className="cursor-pointer text-sm font-semibold">+ Upload photographs</summary>
        <div className="mt-4">
          <GalleryUploadForm />
        </div>
      </details>

      <SortableList
        kind="gallery"
        emptyMessage="No photographs yet. Upload the first ones above."
        items={images.map((image, index) => ({
          id: image.id,
          content: (
            <div>
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={image.imageUrl}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{image.caption || `Photograph ${index + 1}`}</p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {image.imageAlt ? image.imageAlt : "No image description set"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <form action={deleteGalleryImage}>
                  <input type="hidden" name="id" value={image.id} />
                  <DeleteButton confirm="Delete this photograph from the gallery?" />
                </form>
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold">Edit</summary>
                <div className="mt-4">
                  <GalleryEditForm
                    image={{
                      id: image.id,
                      imageUrl: image.imageUrl,
                      caption: image.caption,
                      imageAlt: image.imageAlt,
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
