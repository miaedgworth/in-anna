import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin min-h-svh bg-slate-50">{children}</div>;
}
