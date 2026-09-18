import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export default function AccountSettingsPage() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-6xl flex-col">
        {/* Back */}
        <Link
          href="/account"
          className="mb-4 inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Kembali ke Akun
        </Link>

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
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

        {/* Clerk */}
        <div className="min-h-0 flex-1">
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full !max-w-none",
                card: "w-full !max-w-none min-h-[calc(100dvh-150px)] rounded-2xl border shadow-sm",
                navbar: "w-[180px]",
                pageScrollBox: "min-h-[calc(100dvh-150px)]",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}