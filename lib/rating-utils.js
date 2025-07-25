// Utility functions for rating system

export function displayRating(weightedRating, ratingCount) {
  if (!weightedRating || ratingCount === 0) {
    return {
      stars: "☆☆☆☆☆",
      rating: 0,
      count: 0,
      display: "No ratings yet",
    }
  }

  // Round to nearest 0.5
  const rounded = Math.round(weightedRating * 2) / 2

  // Generate star display
  const fullStars = Math.floor(rounded)
  const hasHalfStar = rounded % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const starDisplay = "★".repeat(fullStars) + (hasHalfStar ? "⭐" : "") + "☆".repeat(emptyStars)

  return {
    stars: starDisplay,
    rating: rounded,
    count: ratingCount,
    display: `${rounded} (${ratingCount} review${ratingCount !== 1 ? "s" : ""})`,
  }
}

export function getRatingColor(rating) {
  if (rating >= 4.5) return "text-green-600"
  if (rating >= 4.0) return "text-green-500"
  if (rating >= 3.5) return "text-yellow-500"
  if (rating >= 3.0) return "text-yellow-600"
  if (rating >= 2.0) return "text-orange-500"
  return "text-red-500"
}

export function validateRating(rating) {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating)
}

export function formatRatingStats(ratings) {
  if (!ratings || ratings.length === 0) {
    return {
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let sum = 0

  ratings.forEach((rating) => {
    distribution[rating.rating]++
    sum += rating.rating
  })

  return {
    average: sum / ratings.length,
    count: ratings.length,
    distribution,
  }
}
