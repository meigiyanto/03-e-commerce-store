"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  categories,
} from "@/data/products";

import type { Product } from "@/data/products";

import { useStore } from "@/context/store-context";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  category: "Audio",
  image: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query)
    );
  }, [products, search]);

  function updateField(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const price = Number(form.price);

    if (!form.name.trim()) {
      alert("Product name wajib diisi.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert("Harga produk tidak valid.");
      return;
    }

    if (!form.description.trim()) {
      alert("Description wajib diisi.");
      return;
    }

    if (!form.image.trim()) {
      alert("Image URL wajib diisi.");
      return;
    }

    if (editingId) {
      const existing = products.find(
        (product) =>
          product.id === editingId
      );

      if (!existing) {
        return;
      }

      const updatedProduct: Product = {
        id: existing.id,
        name: form.name.trim(),
        price,
        description:
          form.description.trim(),
        category: form.category,
        image: form.image.trim(),
      };

      updateProduct(updatedProduct);
    } else {
      let id = createSlug(form.name);

      if (!id) {
        id = `product-${Date.now()}`;
      }

      const idExists = products.some(
        (product) => product.id === id
      );

      if (idExists) {
        id = `${id}-${Date.now()}`;
      }

      const newProduct: Product = {
        id,
        name: form.name.trim(),
        price,
        description:
          form.description.trim(),
        category: form.category,
        image: form.image.trim(),
      };

      addProduct(newProduct);
    }

    resetForm();
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      image: product.image,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteProduct(product.id);

    if (editingId === product.id) {
      resetForm();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
              Product management
            </h1>

            <p className="mt-2 text-slate-600">
              Tambah, lihat, ubah, dan hapus produk
              dari storefront.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            <ArrowLeft size={16} />
            Storefront
          </Link>
        </div>

        {/* CRUD form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {editingId
                  ? "Edit product"
                  : "Add product"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Perbarui informasi produk."
                  : "Tambahkan produk baru ke toko."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <label>
              <span className="mb-2 block text-sm font-medium">
                Product name
              </span>

              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Example Wireless Headphones"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">
                Price
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value
                  )
                }
                placeholder="149.99"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">
                Category
              </span>

              <select
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-cyan-400"
              >
                {categories
                  .filter(
                    (category) =>
                      category !== "All"
                  )
                  .map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">
                Image URL
              </span>

              <input
                type="url"
                value={form.image}
                onChange={(event) =>
                  updateField(
                    "image",
                    event.target.value
                  )
                }
                placeholder="https://..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium">
                Rating
              </span>

              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(event) =>
                  updateField("rating", event.target.value)
                }
                placeholder="4.8"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </label>            

            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-medium">
                Description
              </span>

              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe this product..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />
            </label>            

            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {editingId ? (
                  <>
                    <Pencil size={16} />
                    Update product
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add product
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Product list */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Products ({products.length})
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Semua produk yang tersedia.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-3 py-3 font-medium">
                    Product
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Category
                  </th>

                  <th className="px-3 py-3 font-medium">
                    Price
                  </th>

                  <th className="px-3 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(
                  (product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />

                          <div>
                            <p className="font-semibold text-slate-900">
                              {product.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-600">
                        {product.category}
                      </td>

                      <td className="px-3 py-4 text-sm font-semibold">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500">
                No products found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}