import Link from "next/link";
import type { LucideIcon } from "lucide-react";
export default function StoreEmptyState({
  icon: Icon,
  title,
  description,
  href,
  actionLabel,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-white p-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon size={30} />
      </div>
      <h2 className="mt-5 text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description}
      </p>
      {href && actionLabel && (
        <Link
          href={href}
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
