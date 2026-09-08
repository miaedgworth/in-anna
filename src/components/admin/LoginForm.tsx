"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/FormBits";
import { signInAction, type LoginState } from "@/app/admin/login/actions";

const initial: LoginState = { status: "idle" };

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action] = useActionState(signInAction, initial);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state.status === "error" && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="email" className="admin-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          autoFocus
          className="admin-input"
        />
      </div>

      <div>
        <label htmlFor="password" className="admin-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="admin-input"
        />
      </div>

      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
