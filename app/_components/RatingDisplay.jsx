"use client";

import { Star } from "lucide-react";
import { displayRating, getRatingColor } from "@/lib/rating-utils";

export default function RatingDisplay({
  weightedRating,
  ratingCount,
  size = "md",
  showCount = true,
  showText = true,
}) {
  // Handle cases where rating data might be undefined or null
  const safeWeightedRating = weightedRating || 0;
  const safeRatingCount = ratingCount || 0;

  const rating = displayRating(safeWeightedRating, safeRatingCount);
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (safeRatingCount === 0) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} fill-gray-200 text-gray-200`}
          />
        ))}
        {showText && (
          <span className={`${textSizeClasses[size]} text-gray-500 ml-1`}>
            No ratings yet
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let starClass = `${sizeClasses[size]} `;

        if (star <= Math.floor(rating.rating)) {
          // Full star
          starClass += "fill-yellow-400 text-yellow-400";
        } else if (
          star === Math.ceil(rating.rating) &&
          rating.rating % 1 !== 0
        ) {
          // Half star
          starClass += "fill-yellow-400 text-yellow-400 opacity-50";
        } else {
          // Empty star
          starClass += "fill-gray-200 text-gray-200";
        }

        return <Star key={star} className={starClass} />;
      })}

      {showText && (
        <span
          className={`${textSizeClasses[size]} ${getRatingColor(
            rating.rating
          )} font-medium ml-1`}
        >
          {rating.rating}
        </span>
      )}

      {showCount && safeRatingCount > 0 && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          ({safeRatingCount})
        </span>
      )}
    </div>
  );
}
