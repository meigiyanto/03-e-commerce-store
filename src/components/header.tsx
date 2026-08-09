import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  // const { items } = useCart();

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
          {/* <Link href="/cart" className="text-sm">
            Cart ({items.reduce((s, i) => s + i.quantity, 0)})
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
