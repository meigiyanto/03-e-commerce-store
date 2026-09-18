import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
} from "lucide-react";

export default function AccountDownloadsPage() {
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

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Download size={21} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Downloads
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  File dan dokumen yang tersedia untuk akun Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-14 text-center">
            <FileText
              size={32}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 font-semibold text-gray-900">
              Belum ada file
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tidak ada file yang tersedia untuk akun Anda.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}