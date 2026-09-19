"use client";

export default function StorePageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
