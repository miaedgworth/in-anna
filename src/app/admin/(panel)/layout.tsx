import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions";

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/new-in", label: "New In" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Site settings" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-5 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Inanna Boutique</p>
          <h1 className="text-xl font-semibold">Shop admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="admin-button-secondary">
            View site
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="admin-button-quiet">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {session?.user?.email && (
        <p className="mt-1 text-xs text-slate-500">Signed in as {session.user.email}</p>
      )}

      <nav aria-label="Admin sections" className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-2 border-b border-slate-200 pb-px">
          {tabs.map((tab) => (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className="inline-flex min-h-11 items-center rounded-t-lg px-3 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900"
              >
                {tab.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-7">{children}</div>
    </div>
  );
}
