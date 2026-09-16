import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-primary">
          403
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Akses Ditolak
        </h1>

        <p className="mt-3 text-muted-foreground">
          Anda tidak memiliki izin untuk mengakses
          halaman administrator.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Kembali ke Store
        </Link>
      </div>
    </div>
  );
}