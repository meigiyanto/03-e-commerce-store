import { Star } from "lucide-react";

interface ProductRatingProps {
    rating: number;
    reviewCount?: number;
}

export default function ProductRating({ rating, reviewCount, }: ProductRatingProps) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => {
                    const starNumber = index + 1;

                    return (
                        <Star
                            key={index}
                            size={16}
                            className={
                              starNumber <= Math.round(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                        />
                    )
                })}
            </div>

          <span className="ml-1 text-sm font-medium text-gray-700">
              {rating.toFixed(1)}
          </span>

          {reviewCount !== undefined && (
              <span className="text-sm text-gray-400">
                  ({reviewCount})
              </span>
          )}
        </div>
    )
}