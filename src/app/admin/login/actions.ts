"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginState = { status: "idle" | "error"; message?: string };

/** A successful sign-in redirects by throwing — that must not be swallowed. */
function isRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function signInAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const requested = String(formData.get("redirectTo") ?? "/admin");
  const redirectTo = requested.startsWith("/admin") ? requested : "/admin";

  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo,
    });
    return { status: "idle" };
  } catch (error) {
    if (isRedirect(error)) throw error;

    if (error instanceof AuthError) {
      return { status: "error", message: "That email and password do not match. Please try again." };
    }

    console.error("[admin] sign-in failed:", error);
    return { status: "error", message: "Sign-in is unavailable just now. Please try again shortly." };
  }
}
