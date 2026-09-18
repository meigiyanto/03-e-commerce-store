"use client";

import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";
import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortKey =
  | "name"
  | "price"
  | "category";

type SortDirection =
  | "asc"
  | "desc";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;

  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;

  selectedIds: string[];
  onSelect: (
    id: string,
    checked: boolean
  ) => void;

  onSelectAll: (
    checked: boolean
  ) => void;

  allPageSelected: boolean;
  somePageSelected: boolean;
}

export function ProductTable({
  products,
  onDelete,
  sortKey,
  sortDirection,
  onSort,
  selectedIds,
  onSelect,
  onSelectAll,
  allPageSelected,
  somePageSelected,
}: ProductTableProps) {
  function SortButton({
    column,
    label,
  }: {
    column: SortKey;
    label: string;
  }) {
    const isActive =
      sortKey === column;

    return (
      <button
        type="button"
        onClick={() =>
          onSort(column)
        }
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
            ? sortDirection ===
              "asc"
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
            {/* SELECT ALL */}
            <th className="w-12 px-4 py-3 text-center">
              <input
                type="checkbox"
                checked={
                  allPageSelected
                }
                ref={(element) => {
                  if (element) {
                    element.indeterminate =
                      somePageSelected;
                  }
                }}
                onChange={(event) =>
                  onSelectAll(
                    event.target.checked
                  )
                }
                aria-label="Pilih semua produk di halaman ini"
                className="h-4 w-4 cursor-pointer rounded border"
              />
            </th>

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
          {products.map((product) => {
            const isSelected =
              selectedIds.includes(
                product.id
              );

            return (
              <tr
                key={product.id}
                className={cn(
                  "border-b transition",
                  isSelected &&
                    "bg-muted/50"
                )}
              >
                {/* SELECT */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(event) =>
                      onSelect(
                        product.id,
                        event.target
                          .checked
                      )
                    }
                    aria-label={`Pilih ${product.name}`}
                    className="h-4 w-4 cursor-pointer rounded border"
                  />
                </td>

                {/* IMAGE */}
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

                {/* NAME */}
                <td className="px-4 py-3 font-medium">
                  {product.name}
                </td>

                {/* CATEGORY */}
                <td className="px-4 py-3">
                  {product.category}
                </td>

                {/* PRICE */}
                <td className="px-4 py-3">
                  Rp{" "}
                  {product.price.toLocaleString(
                    "id-ID"
                  )}
                </td>

                {/* STOCK */}
                <td className="px-4 py-3">
                  {product.stock}
                </td>

                {/* ACTIONS */}
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
                        onDelete(
                          product.id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
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