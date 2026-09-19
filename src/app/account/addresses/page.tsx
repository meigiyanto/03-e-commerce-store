"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
// import { useCartStore } from "@/stores/cart-store";

type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
};

const emptyForm = {
  label: "Rumah",
  name: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  isDefault: false,
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

	const loadAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
  
      if (!response.ok) {
        throw new Error("Gagal mengambil alamat.");
      }
  
      const data = await response.json();
      setAddresses(data.addresses ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil alamat."
      );
    } finally {
      setLoading(false);
    }
  };
  
  /*
  useEffect(() => {
    loadAddresses();
  }, []);
  */
  
  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (address: Address) => {
    setEditingId(address.id);

    setForm({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });

    setShowForm(true);
    setMessage("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const url = editingId
        ? `/api/addresses/${editingId}`
        : "/api/addresses";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan alamat.");
      }

      await loadAddresses();
      closeForm();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan alamat."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!window.confirm("Hapus alamat ini?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/addresses/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menghapus alamat."
        );
      }

      await loadAddresses();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus alamat."
      );
    }
  };

  const setDefault = async (address: Address) => {
    try {
      const response = await fetch(
        `/api/addresses/${address.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isDefault: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengatur alamat."
        );
      }

      await loadAddresses();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengatur alamat."
      );
    }
  };

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Kembali ke Akun
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Alamat Pengiriman
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Kelola alamat yang digunakan saat checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
          >
            <Plus size={17} />
            Tambah Alamat
          </button>
        </div>

        {message && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={saveAddress}
            className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId
                  ? "Edit Alamat"
                  : "Tambah Alamat"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Label"
                value={form.label}
                onChange={(value) =>
                  setForm({ ...form, label: value })
                }
                placeholder="Rumah"
              />

              <Field
                label="Nama Penerima"
                value={form.name}
                onChange={(value) =>
                  setForm({ ...form, name: value })
                }
                placeholder="Nama lengkap"
              />

              <Field
                label="Nomor Telepon"
                value={form.phone}
                onChange={(value) =>
                  setForm({ ...form, phone: value })
                }
                placeholder="08xxxxxxxxxx"
              />

              <Field
                label="Kode Pos"
                value={form.postalCode}
                onChange={(value) =>
                  setForm({
                    ...form,
                    postalCode: value,
                  })
                }
                placeholder="40123"
              />

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Alamat Lengkap
                </label>

                <textarea
                  required
                  value={form.address}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      address: event.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Jalan, nomor rumah, RT/RW..."
                />
              </div>

              <Field
                label="Kota"
                value={form.city}
                onChange={(value) =>
                  setForm({ ...form, city: value })
                }
                placeholder="Kota"
              />

              <Field
                label="Provinsi"
                value={form.province}
                onChange={(value) =>
                  setForm({
                    ...form,
                    province: value,
                  })
                }
                placeholder="Provinsi"
              />
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) =>
                  setForm({
                    ...form,
                    isDefault: event.target.checked,
                  })
                }
                className="h-4 w-4 accent-purple-600"
              />
              Jadikan alamat utama
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Alamat"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
              Memuat alamat...
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <MapPin
                size={32}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-4 font-semibold text-gray-900">
                Belum ada alamat
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Tambahkan alamat untuk mempercepat proses checkout.
              </p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                      <MapPin size={20} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-gray-900">
                          {address.label}
                        </h2>

                        {address.isDefault && (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Utama
                          </span>
                        )}
                      </div>

                      <p className="mt-2 font-medium text-gray-800">
                        {address.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {address.phone}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {address.address}
                        <br />
                        {address.city}, {address.province}{" "}
                        {address.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:shrink-0">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefault(address)}
                        className="rounded-lg border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
                      >
                        <Check
                          size={14}
                          className="mr-1 inline"
                        />
                        Jadikan Utama
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openEditForm(address)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                      aria-label="Edit alamat"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAddress(address.id)}
                      className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                      aria-label="Hapus alamat"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        required
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
      />
    </div>
  );
}
