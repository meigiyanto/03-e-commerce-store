import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Login ke NexaShop
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Masuk untuk melanjutkan.
          </p>
        </div>

        <SignIn
          routing="path"
          path="/sign-in"
          forceRedirectUrl="/auth/redirect"
          signUpUrl="/sign-up"
        />
      </div>
    </main>
  );
}
