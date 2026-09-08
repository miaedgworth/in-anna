import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="wordmark text-5xl">inanna</span>
          <h1 className="mt-6 text-lg font-semibold">Shop admin</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to update the website.</p>
        </div>

        <div className="admin-card mt-6">
          <LoginForm redirectTo={from && from.startsWith("/admin") ? from : "/admin"} />
        </div>
      </div>
    </div>
  );
}
