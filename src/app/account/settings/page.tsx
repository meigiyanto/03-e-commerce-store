import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export default function AccountSettingsPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Kembali ke Akun
        </Link>

        <div className="mt-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Settings size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pengaturan Akun
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Kelola profil dan keamanan akun Anda.
              </p>
            </div>
          </div>

          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full rounded-2xl border shadow-sm",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}