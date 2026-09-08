"use client";

import { useActionState } from "react";
import { addGalleryImages, updateGalleryImage, type ActionState } from "@/app/admin/actions";
import { FormMessage, SubmitButton } from "@/components/admin/FormBits";
import { ImageField } from "@/components/admin/ImageField";
import { MultiImageField } from "@/components/admin/MultiImageField";

const initial: ActionState = { status: "idle" };

export function GalleryUploadForm() {
  const [state, action] = useActionState(addGalleryImages, initial);

  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <MultiImageField />
      <div>
        <label htmlFor="gallery-caption" className="admin-label">
          Caption for these photographs (optional)
        </label>
        <input
          id="gallery-caption"
          name="caption"
          type="text"
          placeholder="Applied to every photo in this batch — you can edit each one afterwards."
          className="admin-input"
        />
      </div>
      <SubmitButton>Add to gallery</SubmitButton>
    </form>
  );
}

export type GalleryValues = {
  id: string;
  imageUrl: string;
  caption: string | null;
  imageAlt: string | null;
};

export function GalleryEditForm({ image }: { image: GalleryValues }) {
  const [state, action] = useActionState(updateGalleryImage, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={image.id} />
      <FormMessage state={state} />
      <ImageField name="imageUrl" label="Photograph *" defaultValue={image.imageUrl} required />
      <div>
        <label htmlFor={`gallery-caption-${image.id}`} className="admin-label">
          Caption
        </label>
        <input
          id={`gallery-caption-${image.id}`}
          name="caption"
          type="text"
          defaultValue={image.caption ?? ""}
          className="admin-input"
        />
      </div>
      <div>
        <label htmlFor={`gallery-alt-${image.id}`} className="admin-label">
          Image description (for screen readers)
        </label>
        <input
          id={`gallery-alt-${image.id}`}
          name="imageAlt"
          type="text"
          defaultValue={image.imageAlt ?? ""}
          className="admin-input"
        />
      </div>
      <SubmitButton>Save changes</SubmitButton>
    </form>
  );
}
