import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default async function AccountPage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
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
              Welcome back
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
    
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href="/"
              className="font-medium text-purple-700 hover:underline"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
            NexaShop Account
          </p>
    
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Account
          </h1>
    
          <p className="mt-2 text-muted-foreground">
            Manage your account and personal information.
          </p>
        </div>
    
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="font-semibold">Profile</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Manage your personal information and account settings.
            </p>
          </div>
    
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="font-semibold">Orders</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              View your order history and track your purchases.
            </p>
          </div>
    
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="font-semibold">Security</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Manage your sign-in methods and account security.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}