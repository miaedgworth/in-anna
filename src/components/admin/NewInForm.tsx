"use client";

import { useActionState } from "react";
import { createNewInItem, updateNewInItem, type ActionState } from "@/app/admin/actions";
import { FormMessage, SubmitButton } from "@/components/admin/FormBits";
import { ImageField } from "@/components/admin/ImageField";

export type NewInValues = {
  id: string;
  title: string;
  brandId: string | null;
  imageUrl: string;
  imageAlt: string | null;
  price: string | null;
  note: string | null;
};

export type BrandOption = { id: string; name: string };

const initial: ActionState = { status: "idle" };

export function NewInForm({ item, brands }: { item?: NewInValues; brands: BrandOption[] }) {
  const editing = Boolean(item);
  const [state, action] = useActionState(editing ? updateNewInItem : createNewInItem, initial);
  const key = item?.id ?? "new";

  return (
    <form action={action} className="space-y-4" key={key}>
      {item && <input type="hidden" name="id" value={item.id} />}

      <FormMessage state={state} />

      <ImageField name="imageUrl" label="Photograph" defaultValue={item?.imageUrl} required />

      <div>
        <label htmlFor={`item-title-${key}`} className="admin-label">
          Title *
        </label>
        <input
          id={`item-title-${key}`}
          name="title"
          type="text"
          required
          defaultValue={item?.title ?? ""}
          placeholder="Linen shirt in oat"
          className="admin-input"
        />
      </div>

      <div>
        <label htmlFor={`item-brand-${key}`} className="admin-label">
          Brand
        </label>
        <select
          id={`item-brand-${key}`}
          name="brandId"
          defaultValue={item?.brandId ?? ""}
          className="admin-select"
        >
          <option value="">— No brand —</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`item-price-${key}`} className="admin-label">
            Price
          </label>
          <input
            id={`item-price-${key}`}
            name="price"
            type="text"
            defaultValue={item?.price ?? ""}
            placeholder="£145"
            className="admin-input"
          />
        </div>
        <div>
          <label htmlFor={`item-alt-${key}`} className="admin-label">
            Image description
          </label>
          <input
            id={`item-alt-${key}`}
            name="imageAlt"
            type="text"
            defaultValue={item?.imageAlt ?? ""}
            placeholder="For screen readers"
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`item-note-${key}`} className="admin-label">
          Short note
        </label>
        <input
          id={`item-note-${key}`}
          name="note"
          type="text"
          defaultValue={item?.note ?? ""}
          placeholder="Sizes 8–16 in store"
          className="admin-input"
        />
      </div>


      <SubmitButton>{editing ? "Save changes" : "Add to New In"}</SubmitButton>
    </form>
  );
}
