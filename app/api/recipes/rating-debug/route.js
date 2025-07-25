import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all recipes with their ratings
    const recipes = await prisma.globalRecipe.findMany({
      select: {
        id: true,
        title: true,
        rating: true,
        ratingCount: true,
        ratingSum: true,
        weightedRating: true,
        ratings: {
          select: {
            rating: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    // Calculate detailed statistics for each recipe
    const recipeStats = recipes.map((recipe) => {
      const individualRatings = recipe.ratings.map((r) => r.rating)
      const actualSum = individualRatings.reduce((sum, rating) => sum + rating, 0)
      const actualCount = individualRatings.length
      const actualAverage = actualCount > 0 ? actualSum / actualCount : 0

      // Weighted rating calculation (if implemented)
      const MINIMUM_VOTES = 5
      const globalAverage = 3.0 // Default global average
      const v = actualCount // number of votes
      const R = actualAverage // average rating
      const m = MINIMUM_VOTES // minimum votes threshold
      const C = globalAverage // global average

      // Weighted rating formula: (v × R + m × C) ÷ (v + m)
      const calculatedWeightedRating = v > 0 ? (v * R + m * C) / (v + m) : 0

      return {
        recipeId: recipe.id,
        title: recipe.title,
        storedData: {
          rating: recipe.rating,
          ratingCount: recipe.ratingCount,
          ratingSum: recipe.ratingSum,
          weightedRating: recipe.weightedRating,
        },
        actualData: {
          individualRatings,
          actualSum,
          actualCount,
          actualAverage: Math.round(actualAverage * 100) / 100,
        },
        calculatedWeightedRating: Math.round(calculatedWeightedRating * 100) / 100,
        ratingsBreakdown: recipe.ratings.map((r) => ({
          rating: r.rating,
          user: `${r.user.firstName} ${r.user.lastName}`,
        })),
      }
    })

    // Calculate global statistics
    const allRatings = recipes.flatMap((r) => r.ratings.map((rating) => rating.rating))
    const globalStats = {
      totalRecipes: recipes.length,
      totalRatings: allRatings.length,
      globalAverage: allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length : 0,
      ratingDistribution: {
        5: allRatings.filter((r) => r === 5).length,
        4: allRatings.filter((r) => r === 4).length,
        3: allRatings.filter((r) => r === 3).length,
        2: allRatings.filter((r) => r === 2).length,
        1: allRatings.filter((r) => r === 1).length,
      },
    }

    return NextResponse.json({
      success: true,
      globalStats,
      recipeStats,
      explanation: {
        basicRating: "Simple average: sum of all ratings ÷ number of ratings",
        weightedRating: "Weighted formula: (votes × average + minVotes × globalAvg) ÷ (votes + minVotes)",
        purpose: "Weighted rating prevents recipes with few ratings from ranking too high/low",
      },
    })
  } catch (error) {
    console.error("Rating debug error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
