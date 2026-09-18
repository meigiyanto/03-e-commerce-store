"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Search,
  Download,
  Trash2,
  Plus,
  Package,
  Boxes,
  AlertTriangle,
  Wallet,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useProductStore } from "@/stores/product-store";
import { ProductTable } from "@/components/admin/products/product-table";
import { buttonVariants } from "@/components/ui/button";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [
  10,
  15,
  25,
  50,
];

type SortKey =
  | "name"
  | "price"
  | "category";

type SortDirection =
  | "asc"
  | "desc";

export default function AdminProductsPage() {
  const products = useProductStore(
    (state) => state.products
  );

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
  const [pageSize, setPageSize] =
    useState(10);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

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
   * CATEGORY OPTIONS
   */
  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, "id-ID")
    );
  }, [products]);

  /*
   * SEARCH + FILTER
   */
  const filteredProducts = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.category
          .toLowerCase()
          .includes(keyword) ||
        product.id
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    categoryFilter,
  ]);

  /*
   * SORT
   */
  const sortedProducts = useMemo(() => {
    const sorted = [
      ...filteredProducts,
    ];

    sorted.sort(
      (a: Product, b: Product) => {
        let comparison = 0;

        if (sortKey === "name") {
          comparison =
            a.name.localeCompare(
              b.name,
              "id-ID",
              {
                sensitivity: "base",
              }
            );
        }

        if (sortKey === "category") {
          comparison =
            a.category.localeCompare(
              b.category,
              "id-ID",
              {
                sensitivity: "base",
              }
            );
        }

        if (sortKey === "price") {
          comparison =
            a.price - b.price;
        }

        return sortDirection === "asc"
          ? comparison
          : -comparison;
      }
    );

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
      sortedProducts.length /
        pageSize
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedProducts =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        pageSize;

      return sortedProducts.slice(
        start,
        start + pageSize
      );
    }, [
      sortedProducts,
      currentPage,
      pageSize,
    ]);

  const startItem =
    sortedProducts.length === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const endItem = Math.min(
    currentPage * pageSize,
    sortedProducts.length
  );

  /*
   * STATISTICS
   */
  const totalStock = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + product.stock,
        0
      ),
    [products]
  );

  const lowStockCount = useMemo(
    () =>
      products.filter(
        (product) =>
          product.stock <= 5
      ).length,
    [products]
  );

  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total +
          product.price *
            product.stock,
        0
      ),
    [products]
  );

  /*
   * SORT
   */
  function handleSort(
    key: SortKey
  ) {
    if (sortKey === key) {
      setSortDirection(
        (current) =>
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
   * SEARCH
   */
  function handleSearch(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearch(
      event.target.value
    );
    setPage(1);
  }

  /*
   * CATEGORY
   */
  function handleCategoryChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setCategoryFilter(
      event.target.value
    );
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
   * SELECT SINGLE
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
   * SELECT ALL CURRENT PAGE
   */
  function handleSelectAll(
    checked: boolean
  ) {
    const pageIds =
      paginatedProducts.map(
        (product) => product.id
      );

    if (checked) {
      setSelectedIds((current) =>
        Array.from(
          new Set([
            ...current,
            ...pageIds,
          ])
        )
      );
    } else {
      setSelectedIds((current) =>
        current.filter(
          (id) =>
            !pageIds.includes(id)
        )
      );
    }
  }

  /*
   * DELETE SINGLE
   */
  async function handleDelete(
    id: string
  ) {
    const product =
      products.find(
        (item) => item.id === id
      );

    const confirmed =
      window.confirm(
        `Hapus produk "${product?.name ?? ""}"?`
      );

    if (!confirmed) {
      return;
    }

    const success =
      await deleteProduct(id);

    if (success) {
      setSelectedIds(
        (current) =>
          current.filter(
            (selectedId) =>
              selectedId !== id
          )
      );
    }
  }

  /*
   * BULK DELETE
   */
  async function handleBulkDelete() {
    if (
      selectedIds.length === 0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedIds.length} produk yang dipilih?`
      );

    if (!confirmed) {
      return;
    }

    for (const id of selectedIds) {
      await deleteProduct(id);
    }

    setSelectedIds([]);
  }

  /*
   * CLEAR FILTER
   */
  function clearFilters() {
    setSearch("");
    setCategoryFilter("all");
    setPage(1);
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

    if (
      selectedProducts.length === 0
    ) {
      window.alert(
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
      "Rating",
      "Jumlah Review",
    ];

    const rows =
      selectedProducts.map(
        (product) => [
          product.id,
          product.name,
          product.category,
          product.price,
          product.stock,
          product.rating,
          product.reviewCount ?? 0,
        ]
      );

    function escapeCsvValue(
      value: unknown
    ) {
      return `"${String(value).replace(
        /"/g,
        '""'
      )}"`;
    }

    const csvContent = [
      headers
        .map(escapeCsvValue)
        .join(","),
      ...rows.map((row) =>
        row
          .map(escapeCsvValue)
          .join(",")
      ),
    ].join("\n");

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
   * SELECTION STATE
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

  const hasFilters =
    search.trim() !== "" ||
    categoryFilter !== "all";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/admin"
                className="hover:text-foreground"
              >
                Dashboard
              </Link>

              <span>/</span>

              <span className="text-foreground">
                Products
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Products
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Kelola seluruh produk,
              stok, harga, dan
              inventori toko Anda.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "gap-2"
            )}
          >
            <Plus size={18} />
            Tambah Produk
          </Link>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Terjadi kesalahan
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total products */}
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Produk
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {products.length.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Produk terdaftar
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <Package
                  size={21}
                />
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Stok
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalStock.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Unit tersedia
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <Boxes
                  size={21}
                />
              </div>
            </div>
          </div>

          {/* Low stock */}
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Stok Menipis
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {lowStockCount}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Stok ≤ 5 unit
                </p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <AlertTriangle
                  size={21}
                />
              </div>
            </div>
          </div>

          {/* Inventory value */}
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Nilai Inventori
                </p>

                <p className="mt-2 truncate text-xl font-bold">
                  Rp{" "}
                  {inventoryValue.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Harga × stok
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Wallet
                  size={21}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN PANEL ================= */}
        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          {/* TOOLBAR */}
          <div className="border-b p-4 lg:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              {/* Search */}
              <div className="relative w-full xl:max-w-xl">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Cari nama, kategori, atau ID produk..."
                  className="h-10 w-full rounded-lg border bg-background pl-10 pr-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label="Hapus pencarian"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Category */}
                <select
                  value={categoryFilter}
                  onChange={
                    handleCategoryChange
                  }
                  className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                  aria-label="Filter kategori"
                >
                  <option value="all">
                    Semua kategori
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>

                {/* Export */}
                <button
                  type="button"
                  onClick={
                    handleExport
                  }
                  disabled={
                    sortedProducts.length ===
                    0
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                >
                  <Download
                    size={16}
                  />
                  <span className="hidden sm:inline">
                    Export CSV
                  </span>
                </button>

                {/* Bulk delete */}
                {selectedIds.length >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      handleBulkDelete
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    <Trash2
                      size={16}
                    />

                    <span>
                      Hapus (
                      {
                        selectedIds.length
                      }
                      )
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter status */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Menampilkan{" "}
                  <strong className="text-foreground">
                    {
                      sortedProducts.length
                    }
                  </strong>{" "}
                  produk
                </span>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-4"
                  >
                    <X size={12} />
                    Reset filter
                  </button>
                )}
              </div>

              {selectedIds.length >
                0 && (
                <div className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium">
                  {
                    selectedIds.length
                  }{" "}
                  produk dipilih
                </div>
              )}
            </div>
          </div>

          {/* TABLE */}
          {isLoading &&
          products.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />

                <p className="text-sm text-muted-foreground">
                  Memuat produk...
                </p>
              </div>
            </div>
          ) : (
            <>
              <ProductTable
                products={
                  paginatedProducts
                }
                onDelete={
                  handleDelete
                }
                sortKey={sortKey}
                sortDirection={
                  sortDirection
                }
                onSort={
                  handleSort
                }
                selectedIds={
                  selectedIds
                }
                onSelect={
                  handleSelect
                }
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

              {/* Empty search */}
              {sortedProducts.length ===
                0 &&
                products.length >
                  0 && (
                  <div className="border-t px-6 py-16 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
                      <Search
                        size={24}
                        className="text-muted-foreground"
                      />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      Produk tidak ditemukan
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Coba ubah kata kunci
                      atau filter
                      kategori.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-4 text-sm font-medium underline underline-offset-4"
                    >
                      Reset pencarian
                    </button>
                  </div>
                )}

              {/* PAGINATION */}
              {sortedProducts.length >
                0 && (
                <div className="flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    {startItem}–{endItem}{" "}
                    dari{" "}
                    {
                      sortedProducts.length
                    }
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                      <span>
                        Per halaman
                      </span>

                      <select
                        value={
                          pageSize
                        }
                        onChange={
                          handlePageSizeChange
                        }
                        className="h-8 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                      >
                        {PAGE_SIZE_OPTIONS.map(
                          (size) => (
                            <option
                              key={size}
                              value={
                                size
                              }
                            >
                              {size}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            (prev) =>
                              Math.max(
                                1,
                                prev -
                                  1
                              )
                          )
                        }
                        disabled={
                          currentPage ===
                          1
                        }
                        className="flex size-8 items-center justify-center rounded-md border transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Halaman sebelumnya"
                      >
                        <ChevronLeft
                          size={16}
                        />
                      </button>

                      <div className="flex h-8 min-w-8 items-center justify-center rounded-md bg-foreground px-2 text-xs font-medium text-background">
                        {currentPage}
                      </div>

                      <span className="px-1 text-sm text-muted-foreground">
                        dari{" "}
                        {
                          totalPages
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            (prev) =>
                              Math.min(
                                totalPages,
                                prev +
                                  1
                              )
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        className="flex size-8 items-center justify-center rounded-md border transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                        aria-label="Halaman berikutnya"
                      >
                        <ChevronRight
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}