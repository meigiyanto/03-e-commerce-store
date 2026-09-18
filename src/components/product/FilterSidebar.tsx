"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;

  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;

  minRating: string;
  onMinRatingChange: (value: string) => void;

  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;

  onReset: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  onCategoryChange,

  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,

  minRating,
  onMinRatingChange,

  inStockOnly,
  onInStockOnlyChange,

  onReset,
}: FilterSidebarProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [stockOpen, setStockOpen] = useState(true);

  return (
    <aside className="w-full space-y-4">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Filter
        </h2>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1 text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* =====================================================
          CATEGORY
      ===================================================== */}

      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() =>
            setCategoryOpen((previous) => !previous)
          }
          className="flex w-full items-center justify-between py-2 text-left font-medium"
        >
          <span>Kategori</span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              categoryOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {categoryOpen && (
          <div className="mt-3 space-y-2">
            {/* SEMUA KATEGORI */}

            <RadioOption
              name="category"
              value="Semua"
              label="Semua kategori"
              checked={selectedCategory === "Semua"}
              onChange={() =>
                onCategoryChange("Semua")
              }
            />

            {/* CATEGORIES */}

            {categories
              .filter((category) => category !== "Semua")
              .map((category) => (
                <RadioOption
                  key={category}
                  name="category"
                  value={category}
                  label={category}
                  checked={
                    selectedCategory === category
                  }
                  onChange={() =>
                    onCategoryChange(category)
                  }
                />
              ))}
          </div>
        )}
      </div>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() =>
            setPriceOpen((previous) => !previous)
          }
          className="flex w-full items-center justify-between py-2 text-left font-medium"
        >
          <span>Harga</span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              priceOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {priceOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="min-price"
                className="text-xs"
              >
                Minimum
              </Label>

              <Input
                id="min-price"
                type="number"
                min="0"
                placeholder="Rp 0"
                value={minPrice}
                onChange={(event) =>
                  onMinPriceChange(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="max-price"
                className="text-xs"
              >
                Maksimum
              </Label>

              <Input
                id="max-price"
                type="number"
                min="0"
                placeholder="Tanpa batas"
                value={maxPrice}
                onChange={(event) =>
                  onMaxPriceChange(
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          RATING
      ===================================================== */}

      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() =>
            setRatingOpen((previous) => !previous)
          }
          className="flex w-full items-center justify-between py-2 text-left font-medium"
        >
          <span>Rating</span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              ratingOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {ratingOpen && (
          <div className="mt-3 space-y-2">
            <RadioOption
              name="rating"
              value="0"
              label="Semua rating"
              checked={minRating === "0"}
              onChange={() =>
                onMinRatingChange("0")
              }
            />

            <RadioOption
              name="rating"
              value="4"
              label="⭐ 4 ke atas"
              checked={minRating === "4"}
              onChange={() =>
                onMinRatingChange("4")
              }
            />

            <RadioOption
              name="rating"
              value="3"
              label="⭐ 3 ke atas"
              checked={minRating === "3"}
              onChange={() =>
                onMinRatingChange("3")
              }
            />

            <RadioOption
              name="rating"
              value="2"
              label="⭐ 2 ke atas"
              checked={minRating === "2"}
              onChange={() =>
                onMinRatingChange("2")
              }
            />

            <RadioOption
              name="rating"
              value="1"
              label="⭐ 1 ke atas"
              checked={minRating === "1"}
              onChange={() =>
                onMinRatingChange("1")
              }
            />
          </div>
        )}
      </div>

      {/* =====================================================
          STOCK
      ===================================================== */}

      <div className="pb-2">
        <button
          type="button"
          onClick={() =>
            setStockOpen((previous) => !previous)
          }
          className="flex w-full items-center justify-between py-2 text-left font-medium"
        >
          <span>Ketersediaan</span>

          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              stockOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {stockOpen && (
          <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) =>
                onInStockOnlyChange(
                  event.target.checked
                )
              }
              className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            />

            <span>
              Hanya produk tersedia
            </span>
          </label>
        )}
      </div>
    </aside>
  );
}

/* =========================================================
   CUSTOM RADIO OPTION
========================================================= */

interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        checked
          ? "bg-blue-50 font-semibold text-blue-700"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {/* Hidden native radio */}

      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {/* Custom radio */}

      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          checked
            ? "border-blue-600"
            : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
        )}
      </span>

      {/* Label */}

      <span className="flex-1">
        {label}
      </span>
    </label>
  );
}