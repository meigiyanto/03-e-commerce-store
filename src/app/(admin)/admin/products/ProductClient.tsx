"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useProductStore } from "@/stores/product-store";
import { ProductTable } from "@/components/admin/products/product-table";
import { buttonVariants } from "@/components/ui/button";
import { Product } from "@/types/product";

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

type SortKey = "name" | "price" | "category";
type SortDirection = "asc" | "desc";

export default function AdminProductsPage() {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore(
    (state) => state.fetchProducts
  );
  const deleteProduct = useProductStore(
    (state) => state.deleteProduct
  );
  const isLoading = useProductStore(
    (state) => state.isLoading
  );
  const error = useProductStore(
    (state) => state.error
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] =
    useState<SortKey>("name");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /*
   * SEARCH
   */
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.category
          .toLowerCase()
          .includes(keyword) ||
        product.id
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [products, search]);

  /*
   * SORT
   */
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    sorted.sort((a: Product, b: Product) => {
      let comparison = 0;

      if (sortKey === "name") {
        comparison = a.name.localeCompare(
          b.name,
          "id-ID",
          {
            sensitivity: "base",
          }
        );
      }

      if (sortKey === "category") {
        comparison = a.category.localeCompare(
          b.category,
          "id-ID",
          {
            sensitivity: "base",
          }
        );
      }

      if (sortKey === "price") {
        comparison = a.price - b.price;
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return sorted;
  }, [
    filteredProducts,
    sortKey,
    sortDirection,
  ]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedProducts.length / pageSize
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize;

    const endIndex =
      startIndex + pageSize;

    return sortedProducts.slice(
      startIndex,
      endIndex
    );
  }, [
    sortedProducts,
    currentPage,
    pageSize,
  ]);

  const startItem =
    sortedProducts.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    sortedProducts.length
  );

  /*
   * SORT HANDLER
   */
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    setPage(1);
  }

  /*
   * SEARCH HANDLER
   */
  function handleSearch(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearch(event.target.value);
    setPage(1);
  }

  /*
   * PAGE SIZE
   */
  function handlePageSizeChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setPageSize(
      Number(event.target.value)
    );
    setPage(1);
  }

  /*
   * SELECT SINGLE PRODUCT
   */
  function handleSelect(
    id: string,
    checked: boolean
  ) {
    setSelectedIds((current) => {
      if (checked) {
        if (current.includes(id)) {
          return current;
        }

        return [...current, id];
      }

      return current.filter(
        (selectedId) =>
          selectedId !== id
      );
    });
  }

  /*
   * SELECT ALL PRODUCTS
   * Hanya memilih produk pada halaman aktif.
   */
  function handleSelectAll(
    checked: boolean
  ) {
    const pageIds =
      paginatedProducts.map(
        (product) => product.id
      );

    if (checked) {
      setSelectedIds((current) => {
        return Array.from(
          new Set([
            ...current,
            ...pageIds,
          ])
        );
      });
    } else {
      setSelectedIds((current) =>
        current.filter(
          (id) => !pageIds.includes(id)
        )
      );
    }
  }

  /*
   * DELETE SINGLE PRODUCT
   */
  async function handleDelete(
    id: string
  ) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus produk ini?"
    );

    if (!confirmed) {
      return;
    }

    await deleteProduct(id);

    setSelectedIds((current) =>
      current.filter(
        (selectedId) =>
          selectedId !== id
      )
    );
  }

  /*
   * DELETE SELECTED PRODUCTS
   */
  async function handleBulkDelete() {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk yang dipilih?`
    );

    if (!confirmed) {
      return;
    }

    /*
     * Hapus satu per satu menggunakan
     * action deleteProduct yang sudah ada
     * di Zustand store.
     */
    for (const id of selectedIds) {
      await deleteProduct(id);
    }

    setSelectedIds([]);
  }

  /*
   * EXPORT CSV
   */
  function handleExport() {
    const selectedProducts =
      selectedIds.length > 0
        ? sortedProducts.filter(
            (product) =>
              selectedIds.includes(
                product.id
              )
          )
        : sortedProducts;

    if (selectedProducts.length === 0) {
      alert(
        "Tidak ada data produk untuk diekspor."
      );
      return;
    }

    const headers = [
      "ID",
      "Nama Produk",
      "Kategori",
      "Harga",
      "Stock",
    ];

    const rows = selectedProducts.map(
      (product) => [
        product.id,
        product.name,
        product.category,
        product.price,
        product.stock,
      ]
    );

    /*
     * Escape karakter CSV.
     */
    const escapeCsvValue = (
      value: unknown
    ) => {
      const stringValue = String(value);

      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        row
          .map(escapeCsvValue)
          .join(",")
      ),
    ].join("\n");

    /*
     * BOM agar Excel membaca UTF-8
     * dengan benar.
     */
    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `products-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /*
   * STATUS CHECKBOX HALAMAN AKTIF
   */
  const pageIds =
    paginatedProducts.map(
      (product) => product.id
    );

  const selectedOnPage =
    pageIds.filter((id) =>
      selectedIds.includes(id)
    ).length;

  const allPageSelected =
    paginatedProducts.length > 0 &&
    selectedOnPage ===
      paginatedProducts.length;

  const somePageSelected =
    selectedOnPage > 0 &&
    selectedOnPage <
      paginatedProducts.length;

  return (
    <div className="container mx-auto py-10">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-muted-foreground">
            Kelola produk toko Anda.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={buttonVariants({
            variant: "default",
          })}
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TOOLBAR */}
      <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* SEARCH */}
        <div className="relative w-full lg:max-w-md">
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Cari nama, kategori, atau ID produk..."
            className="w-full rounded-md border bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SELECTED COUNT */}
          {selectedIds.length > 0 && (
            <span className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
              {selectedIds.length} dipilih
            </span>
          )}

          {/* BULK DELETE */}
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={
              selectedIds.length === 0
            }
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hapus Terpilih
          </button>

          {/* EXPORT */}
          <button
            type="button"
            onClick={handleExport}
            disabled={
              sortedProducts.length === 0
            }
            className="rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          Memuat produk...
        </div>
      ) : (
        <>
          <ProductTable
            products={paginatedProducts}
            onDelete={handleDelete}
            sortKey={sortKey}
            sortDirection={
              sortDirection
            }
            onSort={handleSort}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={
              handleSelectAll
            }
            allPageSelected={
              allPageSelected
            }
            somePageSelected={
              somePageSelected
            }
          />

          {/* NO SEARCH RESULT */}
          {sortedProducts.length === 0 &&
            products.length > 0 && (
              <div className="mt-4 rounded-lg border bg-white py-10 text-center text-muted-foreground">
                Tidak ada produk yang
                sesuai dengan pencarian.
              </div>
            )}

          {/* PAGINATION */}
          {sortedProducts.length > 0 && (
            <div className="mt-4 flex flex-col gap-4 rounded-lg border bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
              {/* PAGE SIZE */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Tampilkan</span>

                <select
                  value={pageSize}
                  onChange={
                    handlePageSizeChange
                  }
                  className="rounded-md border bg-white px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Jumlah produk per halaman"
                >
                  {PAGE_SIZE_OPTIONS.map(
                    (size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    )
                  )}
                </select>

                <span>per halaman</span>
              </div>

              {/* INFORMATION */}
              <div className="text-sm text-muted-foreground">
                Menampilkan{" "}
                <span className="font-medium text-foreground">
                  {startItem}
                </span>
                {" - "}
                <span className="font-medium text-foreground">
                  {endItem}
                </span>
                {" dari "}
                <span className="font-medium text-foreground">
                  {
                    sortedProducts.length
                  }
                </span>{" "}
                produk
              </div>

              {/* NAVIGATION */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) =>
                      Math.max(
                        1,
                        prev - 1
                      )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="min-w-[90px] text-center text-sm">
                  Halaman{" "}
                  <span className="font-semibold">
                    {currentPage}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold">
                    {totalPages}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(
                        totalPages,
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}