"use client";

import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";
import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortKey = "name" | "price" | "category";
type SortDirection = "asc" | "desc";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

export function ProductTable({
  products,
  onDelete,
  sortKey,
  sortDirection,
  onSort,
}: ProductTableProps) {
  function SortButton({
    column,
    label,
  }: {
    column: SortKey;
    label: string;
  }) {
    const isActive = sortKey === column;

    return (
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 font-semibold transition hover:opacity-70"
        title={`Urutkan ${label}`}
      >
        {label}

        <span
          className={cn(
            "text-xs",
            isActive
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {isActive
            ? sortDirection === "asc"
              ? "↑"
              : "↓"
            : "↕"}
        </span>
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">
              Image
            </th>

            <th className="px-4 py-3 text-left">
              <SortButton
                column="name"
                label="Name"
              />
            </th>

            <th className="px-4 py-3 text-left">
              <SortButton
                column="category"
                label="Category"
              />
            </th>

            <th className="px-4 py-3 text-left">
              <SortButton
                column="price"
                label="Price"
              />
            </th>

            <th className="px-4 py-3 text-left">
              Stock
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b"
            >
              <td className="px-4 py-3">
                <div className="relative h-12 w-12 overflow-hidden rounded">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>

              <td className="px-4 py-3 font-medium">
                {product.name}
              </td>

              <td className="px-4 py-3">
                {product.category}
              </td>

              <td className="px-4 py-3">
                Rp{" "}
                {product.price.toLocaleString(
                  "id-ID"
                )}
              </td>

              <td className="px-4 py-3">
                {product.stock}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className={cn(
                      buttonVariants({
                        variant:
                          "outline",
                        size: "sm",
                      })
                    )}
                  >
                    Edit
                  </Link>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      onDelete(product.id)
                    }
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Belum ada produk.
        </div>
      )}
    </div>
  );
}