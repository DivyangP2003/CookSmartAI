"use client"

import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function RatingSummary({ ratings = [], totalRating = 0, ratingCount = 0 }) {
  if (ratingCount === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No ratings yet</p>
      </div>
    )
  }

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  // If we have individual ratings, use them; otherwise estimate from average
  if (ratings.length > 0) {
    ratings.forEach((rating) => {
      distribution[rating.rating]++
    })
  } else {
    // Estimate distribution based on average rating
    const avgRating = Math.round(totalRating)
    distribution[avgRating] = ratingCount
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <div className="text-3xl font-bold text-yellow-500">{totalRating.toFixed(1)}</div>
        <div className="flex justify-center mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= Math.round(totalRating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {ratingCount} review{ratingCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating] || 0
          const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-3">{rating}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="w-8 text-gray-600">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
