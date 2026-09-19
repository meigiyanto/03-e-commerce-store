"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, Send, Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type EligibleOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
};

type ReviewSectionProps = {
  productId: string;
  initialOrderId?: string;
};

export default function ReviewSection({ productId, initialOrderId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<EligibleOrder[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadReviews = useCallback(async () => {
  try {
    const response = await fetch(
      `/api/reviews?productId=${encodeURIComponent(productId)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil review.");
    }

    const data = await response.json();

    setReviews(data.reviews ?? []);
    } catch {
      setReviews([]);
    }
  }, [productId]);

  const loadEligibility = useCallback(async () => {
  try {
    const response = await fetch(
      `/api/reviews?productId=${encodeURIComponent(
        productId
      )}&eligible=1`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 401) {
      setOrders([]);
      setReviewed(false);
      return;
    }

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    setOrders(data.orders ?? []);
    setReviewed(Boolean(data.reviewed));
    } catch {
      setOrders([]);
      setReviewed(false);
    }
  }, [productId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([
        loadReviews(),
        loadEligibility(),
      ]);

      setLoading(false);
    };

    load();
  }, [productId, loadReviews, loadEligibility]);

  const submitReview = async () => {
    if (!orders.length) {
      setMessage("Anda belum memiliki pesanan selesai untuk produk ini.");
      return;
    }

    if (!comment.trim()) {
      setMessage("Komentar review wajib diisi.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const orderId =
        initialOrderId &&
        orders.some((order) => order.id === initialOrderId)
          ? initialOrderId
          : orders[0].id;

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengirim review."
        );
      }

      setComment("");
      setRating(5);
      setReviewed(true);

      await Promise.all([
        loadReviews(),
        loadEligibility(),
      ]);

      setMessage("Review berhasil dikirim. Terima kasih!");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengirim review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        <Loader2
          size={18}
          className="mr-2 animate-spin"
        />
        Memuat review...
      </div>
    );
  }

  return (
    <div>
      {/* SUMMARY */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-2xl bg-yellow-50">
          <p className="text-4xl font-bold text-gray-900">
            {averageRating > 0
              ? averageRating.toFixed(1)
              : "0.0"}
          </p>

          <div className="mt-2 flex">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  size={15}
                  className={
                    index <
                    Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              )
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {reviews.length} ulasan
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Ulasan Pelanggan
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Pendapat pelanggan yang telah membeli produk ini.
          </p>
        </div>
      </div>

      {/* WRITE REVIEW */}
      {orders.length > 0 && !reviewed && (
        <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-700">
              <MessageSquare size={19} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Bagaimana pengalaman Anda?
              </h3>

              <p className="text-sm text-gray-500">
                Berikan penilaian untuk produk ini.
              </p>
            </div>
          </div>

          {/* RATING */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-700">
              Rating
            </p>

            <div className="mt-2 flex gap-1">
              {Array.from({ length: 5 }).map(
                (_, index) => {
                  const value = index + 1;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="rounded-lg p-1 transition hover:bg-white"
                      aria-label={`${value} bintang`}
                    >
                      <Star
                        size={27}
                        className={
                          value <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* COMMENT */}
          <div className="mt-5">
            <label
              htmlFor="review-comment"
              className="text-sm font-semibold text-gray-700"
            >
              Komentar
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              rows={4}
              maxLength={1000}
              placeholder="Ceritakan pengalaman Anda..."
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {comment.length}/1000
            </p>
          </div>

          {message && (
            <p className="mt-3 text-sm font-medium text-purple-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={submitReview}
            disabled={submitting}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={17} />
                Kirim Review
              </>
            )}
          </button>
        </div>
      )}

      {/* ALREADY REVIEWED */}
      {reviewed && (
        <div className="mt-8 rounded-xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-700">
          ✓ Anda sudah memberikan review untuk produk ini.
        </div>
      )}

      {/* LOGIN / NOT ELIGIBLE */}
      {orders.length === 0 && !reviewed && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-500">
            Belum ada review dari Anda untuk produk ini.
          </p>

          <Link
            href="/account/sign-in"
            className="mt-4 inline-flex text-sm font-semibold text-purple-700 hover:text-purple-800"
          >
            Login untuk melihat kesempatan review
          </Link>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="mt-8 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <MessageSquare
              size={30}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 font-semibold text-gray-700">
              Belum ada ulasan
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Jadilah pelanggan pertama yang memberikan ulasan.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-gray-100 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Pembeli Terverifikasi
                  </p>

                  <div className="mt-1 flex">
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
                </div>

                <time className="text-xs text-gray-400">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString("id-ID")}
                </time>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                {review.comment}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}