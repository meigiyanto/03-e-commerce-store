import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white p-4">
      <div className="mx-auto max-w-4xl flex items-center justify-between">
        <Link href="/" className="font-semibold">
          E-Store
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/products" className="text-sm">
            Products
          </Link>
        </nav>
      </div>
    </header>
  );
}
