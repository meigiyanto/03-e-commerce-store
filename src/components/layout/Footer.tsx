import Link from "next/link";

const shopLinks = [
  {
    id: "products",
    label: "Produk",
    href: "/products",
  },
  {
    id: "categories",
    label: "Kategori",
    href: "/products",
  },
  {
    id: "promo",
    label: "Promo",
    href: "/promo",
  },
];

const helpLinks = [
  {
    id: "help-center",
    label: "Pusat Bantuan",
    href: "/about",
  },
  {
    id: "how-to-shop",
    label: "Cara Belanja",
    href: "/about",
  },
  {
    id: "shipping",
    label: "Pengiriman",
    href: "/about",
  },
];

const aboutLinks = [
  {
    id: "about",
    label: "Tentang Kami",
    href: "/about",
  },
  {
    id: "contact",
    label: "Kontak",
    href: "/about",
  },
  {
    id: "privacy",
    label: "Kebijakan Privasi",
    href: "/about",
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold text-white"
            >
              Nexa
              <span className="text-blue-500">
                Shop
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed">
              Marketplace modern untuk pengalaman
              belanja yang mudah, aman, dan nyaman.
            </p>
          </div>

          {/* Shop */}
          <FooterColumn
            title="Belanja"
            links={shopLinks}
          />

          {/* Help */}
          <FooterColumn
            title="Bantuan"
            links={helpLinks}
          />

          {/* About */}
          <FooterColumn
            title="Tentang"
            links={aboutLinks}
          />
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm">
          © 2026 NexaShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

type FooterLink = {
  id: string;
  label: string;
  href: string;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

