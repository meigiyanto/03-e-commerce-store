import Link from "next/link";
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

        {/* Registration link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah mempunyai akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-cyan-600 transition hover:text-cyan-700"
            >
              Sign Up
            </Link>
          </p>
      </div>
    </main>
  );
}