"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type AdminProduct,
  type ProductInput,
} from "./product-actions";

type FormState = {
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  rating: string;
};

const initialForm: FormState = {
  name: "",
  price: "",
  description: "",
  category: "",
  image: "",
  rating: "0",
};

export default function AdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const isEditing = editingId !== null;

  // --------------------------------------------------
  // READ - Load products from Prisma
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);

        const data = await getProducts();

        if (mounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);

        if (mounted) {
          alert(
            error instanceof Error
              ? error.message
              : "Gagal mengambil data produk."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category))
    ).sort();
  }, [products]);

  // --------------------------------------------------
  // Filter products
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  // --------------------------------------------------
  // Form helpers
  // --------------------------------------------------

  function updateForm(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(product: AdminProduct) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
      rating: String(product.rating),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const price = Number(form.price);
    const rating = Number(form.rating);

    if (!form.name.trim()) {
      alert("Nama produk wajib diisi.");
      return;
    }

    if (!form.description.trim()) {
      alert("Deskripsi produk wajib diisi.");
      return;
    }

    if (!form.category.trim()) {
      alert("Kategori produk wajib diisi.");
      return;
    }

    if (!form.image.trim()) {
      alert("URL gambar produk wajib diisi.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Harga produk tidak valid.");
      return;
    }

    if (
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5
    ) {
      alert("Rating harus berada di antara 0 sampai 5.");
      return;
    }

    const productData: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category.trim(),
      image: form.image.trim(),
      rating,
    };

    try {
      setSaving(true);

      // UPDATE
      if (editingId) {
        const updatedProduct = await updateProduct(
          Number(editingId),
          productData
        );

        setProducts((current) =>
          current.map((product) =>
            product.id === updatedProduct.id
              ? updatedProduct
              : product
          )
        );

        alert("Produk berhasil diperbarui.");
      }

      // CREATE
      else {
        const newProduct = await createProduct(
          productData
        );

        setProducts((current) => [
          newProduct,
          ...current,
        ]);

        alert("Produk berhasil ditambahkan.");
      }

      resetForm();
    } catch (error) {
      console.error(
        "Failed to save product:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan produk."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete(
    product: AdminProduct
  ) {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteProduct(Number(product.id));

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );

      if (editingId === product.id) {
        resetForm();
      }

      alert("Produk berhasil dihapus.");
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus produk."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Kelola produk yang tersimpan di Prisma
            Postgres.
          </p>
        </div>

        {/* Product Form */}
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Perbarui informasi produk."
                  : "Tambahkan produk baru ke database."}
              </p>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="product-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>

              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateForm(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Contoh: Wireless Headphones"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Price
              </label>

              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateForm(
                    "price",
                    event.target.value
                  )
                }
                placeholder="149.99"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="product-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="product-category"
                type="text"
                value={form.category}
                onChange={(event) =>
                  updateForm(
                    "category",
                    event.target.value
                  )
                }
                placeholder="Audio"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              />
            </div>

            {/* Rating */}
            <div>
              <label
                htmlFor="product-rating"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Rating
              </label>

              <input
                id="product-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(event) =>
                  updateForm(
                    "rating",
                    event.target.value
                  )
                }
                placeholder="4.5"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label
                htmlFor="product-image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>

              <input
                id="product-image"
                type="url"
                value={form.image}
                onChange={(event) =>
                  updateForm(
                    "image",
                    event.target.value
                  )
                }
                placeholder="https://example.com/image.jpg"
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="product-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="product-description"
                value={form.description}
                onChange={(event) =>
                  updateForm(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Deskripsi produk..."
                rows={5}
                disabled={saving}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-black disabled:bg-gray-100"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </section>

        {/* Products */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {products.length} product
                  {products.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-black"
                />

                {/* Category */}
                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-black"
                >
                  <option value="all">
                    All categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading products...
            </div>
          )}

          {/* Empty */}
          {!loading &&
            filteredProducts.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-sm text-gray-500">
                  Tidak ada produk yang ditemukan.
                </p>
              </div>
            )}

          {/* Product Table */}
          {!loading &&
            filteredProducts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Product
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Price
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Rating
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredProducts.map(
                      (product) => (
                        <tr key={product.id}>
                          {/* Product */}
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.name}
                                </div>

                                <div className="mt-1 max-w-xs truncate text-sm text-gray-500">
                                  {
                                    product.description
                                  }
                                </div>

                                <div className="mt-1 text-xs text-gray-400">
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                            {product.category}
                          </td>

                          {/* Price */}
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </td>

                          {/* Rating */}
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                            ⭐ {product.rating.toFixed(1)}
                          </td>

                          {/* Actions */}
                          <td className="whitespace-nowrap px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startEdit(
                                    product
                                  )
                                }
                                disabled={saving}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                disabled={saving}
                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </main>
  );
}