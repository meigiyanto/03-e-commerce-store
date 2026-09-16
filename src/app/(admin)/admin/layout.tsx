import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Store,
} from "lucide-react";

const navigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-background md:flex md:flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-5" />
          </div>

          <div>
            <p className="font-semibold leading-none">
              NexaShop
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Management
          </p>

          {navigation.map(
            ({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ),
          )}
        </nav>

        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Store className="size-4" />
            View Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur md:px-8">
          <div className="md:hidden">
            <Link
              href="/admin"
              className="font-semibold"
            >
              NexaShop Admin
            </Link>
          </div>

          <div className="ml-auto text-sm text-muted-foreground">
            Administration
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}