"use client";

import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

export function SubmitButton({
  children = "Save",
  variant = "primary",
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={variant === "primary" ? "admin-button" : "admin-button-secondary"}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function DeleteButton({ label = "Delete", confirm }: { label?: string; confirm: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirm)) event.preventDefault();
      }}
      className="admin-button-danger"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      role="status"
      className={`rounded-md px-3 py-2 text-sm ${
        state.status === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"
      }`}
    >
      {state.message}
    </p>
  );
}
