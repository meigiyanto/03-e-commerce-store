import { SignIn, UserButton,} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, CalendarDays, Download, FileText, HelpCircle, Home, MapPin,  Package, Settings, ShoppingBag,Star, UserRound, } from "lucide-react";
import Link from "next/link";

import SignOutButton from "@/components/auth/SignOutButton";

export default async function AccountPage() {
  const user = await currentUser();

  /*
   * Guest state
   */
  if (!user) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-700 text-xl font-bold text-white shadow-sm">
              N
            </div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
              NexaShop Account
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to NexaShop
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to manage your account, view your orders, and enjoy a
              better shopping experience.
            </p>
          </div>

          <div className="w-full">
            <SignIn
              routing="hash"
              fallbackRedirectUrl="/account"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full rounded-2xl border shadow-sm",
                },
              }}
            />
          </div>

          <Link
            href="/products"
            className="mt-6 text-sm font-medium text-purple-700 hover:underline"
          >
            ← Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "NexaShop User";
  const email = user.emailAddresses[0]?.emailAddress ?? "No email address";
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b bg-background lg:min-h-[calc(100vh-4rem)] lg:w-64 lg:border-b-0 lg:border-r">
          <div className="p-4 sm:p-6 lg:sticky lg:top-16">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
        
              <div>
                <p className="text-sm font-semibold">{fullName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
        
            <nav className="space-y-1">
              <AccountNavItem
                href="/account"
                icon={<Home className="h-4 w-4" />}
                label="Overview"
                active
              />
        
              <AccountNavItem
                href="/account/orders"
                icon={<ShoppingBag className="h-4 w-4" />}
                label="Orders"
              />
        
              <AccountNavItem
                href="/account/addresses"
                icon={<MapPin className="h-4 w-4" />}
                label="Addresses"
              />
        
              <AccountNavItem
                href="/account/reviews"
                icon={<Star className="h-4 w-4" />}
                label="Reviews"
              />
        
              <AccountNavItem
                href="/account/downloads"
                icon={<Download className="h-4 w-4" />}
                label="Downloads"
              />
        
              <AccountNavItem
                href="/account/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Account Settings"
              />
        
              <div className="my-3 border-t" />
        
              <SignOutButton />
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-2xl border bg-purple-50 p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-200/40 blur-3xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="shrink-0">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={fullName}
                      className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-purple-100 text-purple-700 shadow-sm">
                      <UserRound className="h-9 w-9" />
                    </div>
                  )}
                </div>

                <div>
                  <p className="mb-1 text-sm font-semibold text-purple-700">
                    NexaShop Account
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Welcome back, {user.firstName || fullName}!
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Manage your account, view orders, and update your
                    preferences from your personal dashboard.
                  </p>
                </div>
              </div>
            </section>

            {/* Profile information */}
            <section className="rounded-2xl border bg-background shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Your personal account information.
                </p>
              </div>

              <div className="grid md:grid-cols-[220px_1fr]">
                {/* Profile */}
                <div className="flex flex-col items-center justify-center border-b p-6 text-center md:border-b-0 md:border-r">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={fullName}
                      className="h-28 w-28 rounded-full border-4 border-purple-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      <UserRound className="h-12 w-12" />
                    </div>
                  )}

                  <h3 className="mt-4 font-semibold">{fullName}</h3>

                  <p className="mt-1 max-w-full truncate text-sm text-muted-foreground">
                    {email}
                  </p>

                  <Link
                    href="/account/settings"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </div>

                {/* Details */}
                <div className="divide-y">
                  <ProfileRow
                    icon={<UserRound className="h-5 w-5" />}
                    label="Full Name"
                    value={fullName}
                  />

                  <ProfileRow
                    icon={<FileText className="h-5 w-5" />}
                    label="Email Address"
                    value={email}
                  />

                  <ProfileRow
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Member Since"
                    value={memberSince}
                  />
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="grid gap-4 sm:grid-cols-3">
              <QuickActionCard
                href="/account/orders"
                icon={<Package className="h-6 w-6" />}
                title="View Orders"
                description="Track your recent orders and order history."
                button="View Orders"
                variant="purple"
              />

              <QuickActionCard
                href="/account/addresses"
                icon={<MapPin className="h-6 w-6" />}
                title="Manage Addresses"
                description="Update your shipping and billing addresses."
                button="Manage Addresses"
                variant="green"
              />

              <QuickActionCard
                href="/account/settings"
                icon={<Settings className="h-6 w-6" />}
                title="Account Settings"
                description="Edit your profile and account details."
                button="Edit Account"
                variant="yellow"
              />
            </section>

            {/* Recent Orders */}
            <section className="rounded-2xl border bg-background shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your latest purchases.
                  </p>
                </div>

                <Link
                  href="/account/orders"
                  className="hidden items-center gap-1 text-sm font-medium text-purple-700 hover:underline sm:flex"
                >
                  View All Orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-700">
                  <ShoppingBag className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-semibold">
                  No orders yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Your recent orders will appear here after you make a
                  purchase.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-purple-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-800"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* Help */}
            <section className="flex flex-col gap-4 rounded-2xl border bg-purple-50 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <HelpCircle className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="font-semibold">Need help?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Visit our help center or contact our support team.
                  </p>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-800"
              >
                Get Support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function AccountNavItem({ href, icon, label, active = false,}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "bg-purple-50 text-purple-700"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function ProfileRow({ icon, label, value, }: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  button,
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  button: string;
  variant: "purple" | "green" | "yellow";
}) {
  const styles = {
    purple: {
      card: "bg-purple-50 border-purple-100",
      icon: "bg-purple-600 text-white",
      button: "bg-purple-700 hover:bg-purple-800",
    },
    green: {
      card: "bg-emerald-50 border-emerald-100",
      icon: "bg-emerald-600 text-white",
      button: "bg-emerald-600 hover:bg-emerald-700",
    },
    yellow: {
      card: "bg-amber-50 border-amber-100",
      icon: "bg-amber-500 text-white",
      button: "bg-amber-500 hover:bg-amber-600",
    },
  };
  const style = styles[variant];

  return (
    <div className={`rounded-2xl border p-5 ${style.card}`}>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${style.icon}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <Link
        href={href}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${style.button}`}
      >
        {button}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}