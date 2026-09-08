"use client";

import { useActionState } from "react";
import { createBrand, updateBrand, type ActionState } from "@/app/admin/actions";
import { FormMessage, SubmitButton } from "@/components/admin/FormBits";
import { ImageField } from "@/components/admin/ImageField";

export type BrandValues = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  websiteUrl: string | null;
  visible: boolean;
};

const initial: ActionState = { status: "idle" };

export function BrandForm({ brand }: { brand?: BrandValues }) {
  const editing = Boolean(brand);
  const [state, action] = useActionState(editing ? updateBrand : createBrand, initial);

  return (
    <form action={action} className="space-y-4" key={brand?.id ?? "new"}>
      {brand && <input type="hidden" name="id" value={brand.id} />}

      <FormMessage state={state} />

      <div>
        <label htmlFor={`brand-name-${brand?.id ?? "new"}`} className="admin-label">
          Brand name *
        </label>
        <input
          id={`brand-name-${brand?.id ?? "new"}`}
          name="name"
          type="text"
          required
          defaultValue={brand?.name ?? ""}
          className="admin-input"
        />
      </div>

      <ImageField
        name="imageUrl"
        label="Logo or representative image"
        defaultValue={brand?.imageUrl}
        help="A logo on a plain background works best. If you leave this empty the brand name is set in type instead."
      />

      <div>
        <label htmlFor={`brand-alt-${brand?.id ?? "new"}`} className="admin-label">
          Image description (for screen readers)
        </label>
        <input
          id={`brand-alt-${brand?.id ?? "new"}`}
          name="imageAlt"
          type="text"
          defaultValue={brand?.imageAlt ?? ""}
          placeholder={brand?.name ? `${brand.name} logo` : "Brand logo"}
          className="admin-input"
        />
      </div>

      <div>
        <label htmlFor={`brand-desc-${brand?.id ?? "new"}`} className="admin-label">
          Description
        </label>
        <textarea
          id={`brand-desc-${brand?.id ?? "new"}`}
          name="description"
          rows={3}
          defaultValue={brand?.description ?? ""}
          placeholder="One or two sentences about the label."
          className="admin-textarea"
        />
      </div>

      <div>
        <label htmlFor={`brand-url-${brand?.id ?? "new"}`} className="admin-label">
          Website
        </label>
        <input
          id={`brand-url-${brand?.id ?? "new"}`}
          name="websiteUrl"
          type="url"
          inputMode="url"
          defaultValue={brand?.websiteUrl ?? ""}
          placeholder="https://"
          className="admin-input"
        />
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          name="visible"
          type="checkbox"
          defaultChecked={brand ? brand.visible : true}
          className="h-5 w-5"
        />
        Show this brand on the website
      </label>

      <SubmitButton>{editing ? "Save changes" : "Add brand"}</SubmitButton>
    </form>
  );
}
