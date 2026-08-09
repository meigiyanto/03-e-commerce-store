import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Masuk untuk melanjutkan belanja.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}