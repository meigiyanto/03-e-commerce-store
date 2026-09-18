"use client"

import { useState } from "react"
import { ChevronDown, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FilterSidebarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  minPrice: string
  maxPrice: string
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  minRating: string
  onMinRatingChange: (value: string) => void
  inStockOnly: boolean
  onInStockOnlyChange: (value: boolean) => void
  onReset: () => void
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
  const [categoryOpen, setCategoryOpen] = useState(true)
  const [priceOpen, setPriceOpen] = useState(true)
  const [ratingOpen, setRatingOpen] = useState(true)
  const [stockOpen, setStockOpen] = useState(true)

  return (
    <aside className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter</h2>

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

      {/* Category */}
      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() => setCategoryOpen((prev) => !prev)}
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
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={() => onCategoryChange("")}
                className="h-4 w-4"
              />

              <span>Semua kategori</span>
            </label>

            {categories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => onCategoryChange(category)}
                  className="h-4 w-4"
                />

                <span>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() => setPriceOpen((prev) => !prev)}
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
              <Label htmlFor="min-price" className="text-xs">
                Minimum
              </Label>

              <Input
                id="min-price"
                type="number"
                min="0"
                placeholder="Rp 0"
                value={minPrice}
                onChange={(event) =>
                  onMinPriceChange(event.target.value)
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="max-price" className="text-xs">
                Maksimum
              </Label>

              <Input
                id="max-price"
                type="number"
                min="0"
                placeholder="Tanpa batas"
                value={maxPrice}
                onChange={(event) =>
                  onMaxPriceChange(event.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b pb-4">
        <button
          type="button"
          onClick={() => setRatingOpen((prev) => !prev)}
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
            {[
              { value: "", label: "Semua rating" },
              { value: "4", label: "⭐ 4 ke atas" },
              { value: "3", label: "⭐ 3 ke atas" },
              { value: "2", label: "⭐ 2 ke atas" },
              { value: "1", label: "⭐ 1 ke atas" },
            ].map((rating) => (
              <label
                key={rating.value || "all"}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="min-rating"
                  value={rating.value}
                  checked={minRating === rating.value}
                  onChange={() =>
                    onMinRatingChange(rating.value)
                  }
                  className="h-4 w-4"
                />

                <span>{rating.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Stock */}
      <div className="pb-2">
        <button
          type="button"
          onClick={() => setStockOpen((prev) => !prev)}
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
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) =>
                onInStockOnlyChange(event.target.checked)
              }
              className="h-4 w-4 rounded"
            />

            <span>Hanya produk tersedia</span>
          </label>
        )}
      </div>
    </aside>
  )
}