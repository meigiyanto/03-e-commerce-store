"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit3,
  Trash2,
  Package,
} from "lucide-react";

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
  onSelect: (id: string, checked: boolean) => void;

  onSelectAll: (checked: boolean) => void;

  allPageSelected: boolean;
  somePageSelected: boolean;
}

function SortButton({
  column,
  label,
  sortKey,
  sortDirection,
  onSort,
}: {
  column: SortKey;
  label: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const isActive = sortKey === column;

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className="group inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition hover:text-foreground"
      title={`Urutkan ${label}`}
    >
      <span>{label}</span>

      {isActive ? (
        sortDirection === "asc" ? (
          <ArrowUp
            size={14}
            className="text-foreground"
          />
        ) : (
          <ArrowDown
            size={14}
            className="text-foreground"
          />
        )
      ) : (
        <ArrowUpDown
          size={14}
          className="text-muted-foreground/60 transition group-hover:text-foreground"
        />
      )}
    </button>
  );
}

function getStockStatus( stock: number ) {
    if (stock <= 0) {
      return {
        label: "Habis",
        className:
          "bg-destructive/10 text-destructive",
      };
    }

    if (stock <= 5) {
      return {
        label: "Menipis",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      };
    }

    return {
      label: "Tersedia",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    };
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px]">
        <thead className="border-b bg-muted/30">
          <tr className="text-xs uppercase tracking-wide">
            {/* SELECT */}
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
                aria-label="Pilih semua produk di halaman"
                className="size-4 cursor-pointer rounded border accent-current"
              />
            </th>

            {/* PRODUCT */}
            <th className="px-4 py-3 text-left">
              <span className="font-semibold text-muted-foreground">
                Produk
              </span>
            </th>

            {/* CATEGORY */}
            <th className="px-4 py-3 text-left">
              <SortButton
                column="category"
                label="Kategori"
              />
            </th>

            {/* PRICE */}
            <th className="px-4 py-3 text-left">
              <SortButton
                column="price"
                label="Harga"
              />
            </th>

            {/* STOCK */}
            <th className="px-4 py-3 text-left">
              <span className="font-semibold text-muted-foreground">
                Stok
              </span>
            </th>

            {/* RATING */}
            <th className="px-4 py-3 text-left">
              <span className="font-semibold text-muted-foreground">
                Rating
              </span>
            </th>

            {/* ACTIONS */}
            <th className="px-4 py-3 text-right">
              <span className="font-semibold text-muted-foreground">
                Aksi
              </span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {products.map((product) => {
            const isSelected =
              selectedIds.includes(
                product.id
              );

            const stockStatus =
              getStockStatus(
                product.stock
              );

            return (
              <tr
                key={product.id}
                className={cn(
                  "group transition-colors hover:bg-muted/30",
                  isSelected &&
                    "bg-muted/50"
                )}
              >
                {/* CHECKBOX */}
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={
                      isSelected
                    }
                    onChange={(
                      event
                    ) =>
                      onSelect(
                        product.id,
                        event.target
                          .checked
                      )
                    }
                    aria-label={`Pilih ${product.name}`}
                    className="size-4 cursor-pointer rounded border accent-current"
                  />
                </td>

                {/* PRODUCT */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border bg-muted">
                      {product.image ? (
                        <Image
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          fill
                          sizes="48px"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package
                            size={20}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {product.name}
                      </p>

                      <p className="mt-0.5 max-w-[280px] truncate font-mono text-xs text-muted-foreground">
                        {product.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {product.category}
                  </span>
                </td>

                {/* PRICE */}
                <td className="px-4 py-4">
                  <p className="font-semibold">
                    Rp{" "}
                    {product.price.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </td>

                {/* STOCK */}
                <td className="px-4 py-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="font-semibold">
                      {product.stock.toLocaleString(
                        "id-ID"
                      )}
                    </span>

                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        stockStatus.className
                      )}
                    >
                      {
                        stockStatus.label
                      }
                    </span>
                  </div>
                </td>

                {/* RATING */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">
                      {product.rating.toFixed(
                        1
                      )}
                    </span>

                    <span className="text-sm">
                      ★
                    </span>

                    {product.reviewCount !==
                      undefined && (
                      <span className="text-xs text-muted-foreground">
                        (
                        {
                          product.reviewCount
                        }
                        )
                      </span>
                    )}
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className={cn(
                        buttonVariants(
                          {
                            variant:
                              "ghost",
                            size: "icon-sm",
                          }
                        ),
                        "text-muted-foreground hover:text-foreground"
                      )}
                      title="Edit produk"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit3
                        size={16}
                      />
                    </Link>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        onDelete(
                          product.id
                        )
                      }
                      title="Hapus produk"
                      aria-label={`Hapus ${product.name}`}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2
                        size={16}
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Package
              size={25}
              className="text-muted-foreground"
            />
          </div>

          <h3 className="mt-4 font-semibold">
            Belum ada produk
          </h3>

          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Produk yang Anda tambahkan
            akan muncul di tabel ini.
          </p>

          <Link
            href="/admin/products/new"
            className={cn(
              buttonVariants({
                size: "sm",
              }),
              "mt-5 gap-2"
            )}
          >
            <Package size={15} />
            Tambah Produk
          </Link>
        </div>
      )}
    </div>
  );
}