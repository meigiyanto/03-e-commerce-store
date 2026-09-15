import { SignedIn, SignedOut, SignIn, SignUp, UserProfile, } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        <SignedOut>
          <div className="mb-8 max-w-xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
            NexaShop Account
            </p>
    
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to NexaShop
            </h1>
    
            <p className="mt-3 text-muted-foreground">
              Sign in to manage your account, view your orders, and enjoy a
              better shopping experience.
            </p>
          </div>
          <div className="w-full max-w-md">
            <SignIn
              fallbackRedirectUrl="/account"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-sm border",
                },
              }}
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <a
              href="/account?signup=true"
              className="font-medium text-purple-700 hover:underline"
            >
              Create one
            </a>
          </p>
        </SignedOut>
        <SignedIn>
          <div className="mb-8 w-full max-w-4xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
              My Account
            </p>
    
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
    
            <p className="mt-2 text-muted-foreground">
              Manage your profile, security, and account information.
            </p>
          </div>
    
          <div className="w-full max-w-4xl">
            <UserProfile />
          </div>
        </SignedIn>
      </div>
    </main>
  );
}