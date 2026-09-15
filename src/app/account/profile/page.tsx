import { UserProfile } from "@clerk/nextjs";

export default function AccountProfilePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
          NexaShop
          </p>
  
          <h1 className="text-3xl font-bold tracking-tight">
            My Account
          </h1>
    
          <p className="mt-2 text-muted-foreground">
            Manage your profile and account settings.
          </p>
        </div>
    
        <UserProfile routing="hash" />
      </div>
    </main>
  );
}