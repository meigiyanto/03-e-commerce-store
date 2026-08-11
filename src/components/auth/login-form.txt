"use client";

import { FormEvent, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoaded) {
      return;
    }

    setError("");
    setLoading(true);

    const callbackUrl =
      searchParams.get("callbackUrl") || "/";

    try {
      const result = await signIn.create({
        identifier: email.trim().toLowerCase(),
        password,
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });

        router.push(callbackUrl);
        router.refresh();

        return;
      }

      setError(
        "Login belum dapat diselesaikan. Silakan coba lagi."
      );
    } catch (error: unknown) {
      console.error("CLERK_LOGIN_ERROR", error);

      setError(
        "Email atau password tidak valid."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
          required
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !isLoaded}
        className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}