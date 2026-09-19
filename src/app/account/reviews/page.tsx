"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
};

export default function AccountReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch(
          "/api/reviews?mine=1"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil review.");
        }

        const data = await response.json();

        setReviews(data.reviews ?? []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

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

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Review Saya
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review produk yang pernah Anda beli.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-12 text-center text-sm text-gray-500">
            Memuat review...
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <MessageSquare
              size={34}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 font-semibold text-gray-900">
              Belum ada review
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Review dapat diberikan setelah pesanan selesai.
            </p>

            <Link
              href="/account/orders"
              className="mt-6 inline-flex rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Lihat Pesanan
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <Image
                    src={review.product.image}
                    alt={review.product.name}
                    className="h-20 w-20 rounded-xl bg-gray-50 object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900">
                      {review.product.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={15}
                            className={
                              index < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        )
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}