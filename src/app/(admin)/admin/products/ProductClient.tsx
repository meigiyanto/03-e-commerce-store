"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/stores/product-store";
import { ProductTable } from "@/components/admin/products/product-table";
import { buttonVariants } from "@/components/ui/button";

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50];

export default function AdminProductsPage() {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return products.slice(startIndex, endIndex);
  }, [products, currentPage, pageSize]);

  const startItem =
    products.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    products.length
  );

  function handlePageSizeChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setPageSize(Number(event.target.value));
    setPage(1);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus produk ini?"
    );

    if (!confirmed) {
      return;
    }

    await deleteProduct(id);

    // Jika halaman terakhir menjadi kosong setelah delete,
    // pindahkan user ke halaman sebelumnya.
    const remainingProducts = products.length - 1;
    const newTotalPages = Math.max(
      1,
      Math.ceil(remainingProducts / pageSize)
    );

    if (currentPage > newTotalPages) {
      setPage(newTotalPages);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
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

      {isLoading && products.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          Memuat produk...
        </div>
      ) : (
        <>
          <ProductTable
            products={paginatedProducts}
            onDelete={handleDelete}
          />

          {products.length > 0 && (
            <div className="mt-4 flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Jumlah data per halaman */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Tampilkan</span>

                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="rounded-md border bg-white px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Jumlah produk per halaman"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <span>per halaman</span>
              </div>

              {/* Informasi data */}
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
                  {products.length}
                </span>{" "}
                produk
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
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
                      Math.min(totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
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