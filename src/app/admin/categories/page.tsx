import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">
            Manage your store categories
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Category
        </Link>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Categories
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {categories.length}
          </h2>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Slug
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Description
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  {category.name}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {category.slug}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {category.description || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="rounded-md bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                    >
                      Edit
                    </Link>

                    <button
                      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-500"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
