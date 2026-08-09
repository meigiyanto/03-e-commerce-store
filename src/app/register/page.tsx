import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Create account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Daftar untuk mulai berbelanja dan mengelola
            pesanan Anda.
          </p>
        </div>

        {/* Register form */}
        <RegisterForm />

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah mempunyai akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-600 transition hover:text-cyan-700"
          >
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}
