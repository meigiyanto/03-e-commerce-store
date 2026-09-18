import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Daftar di NexaShop
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Buat akun baru untuk mulai berbelanja.
          </p>
        </div>

        <SignUp
          routing="path"
          path="/account/sign-up"
          signInUrl="/account/sign-in"
          forceRedirectUrl="/account"
        />
      </div>
    </main>
  );
}