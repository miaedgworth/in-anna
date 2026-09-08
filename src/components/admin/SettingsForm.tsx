"use client";

import { useActionState } from "react";
import { saveSettings, type ActionState } from "@/app/admin/actions";
import { FormMessage, SubmitButton } from "@/components/admin/FormBits";

export type SettingField = {
  key: string;
  label: string;
  help: string;
  type: "text" | "textarea";
  value: string;
};

const initial: ActionState = { status: "idle" };

export function SettingsForm({ fields }: { fields: SettingField[] }) {
  const [state, action] = useActionState(saveSettings, initial);

  return (
    <form action={action} className="space-y-6">
      <FormMessage state={state} />

      {fields.map((field) => (
        <div key={field.key} className="admin-card">
          <label htmlFor={`setting-${field.key}`} className="admin-label">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={`setting-${field.key}`}
              name={field.key}
              rows={4}
              defaultValue={field.value}
              className="admin-textarea"
            />
          ) : (
            <input
              id={`setting-${field.key}`}
              name={field.key}
              type="text"
              defaultValue={field.value}
              className="admin-input"
            />
          )}
          <p className="mt-1.5 text-xs text-slate-500">{field.help}</p>
        </div>
      ))}

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:px-4">
        <SubmitButton>Save site settings</SubmitButton>
      </div>
    </form>
  );
}
