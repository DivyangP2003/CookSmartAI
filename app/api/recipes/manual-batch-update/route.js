import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Manual trigger for batch rating updates (for testing)
export async function POST(request) {
  try {
    console.log("Starting manual rating batch update...")

    // Step 1: Calculate global average rating for recipes with minimum threshold
    const MINIMUM_VOTES = 5

    // Get all recipes with ratings to calculate global average
    const recipesWithRatings = await prisma.globalRecipe.findMany({
      where: {
        ratingCount: {
          gt: 0,
        },
      },
      select: {
        ratingSum: true,
        ratingCount: true,
      },
    })

    let globalAverage = 3.0 // Default fallback
    if (recipesWithRatings.length > 0) {
      const totalSum = recipesWithRatings.reduce((sum, recipe) => sum + (recipe.ratingSum || 0), 0)
      const totalCount = recipesWithRatings.reduce((sum, recipe) => sum + (recipe.ratingCount || 0), 0)
      globalAverage = totalCount > 0 ? totalSum / totalCount : 3.0
    }

    console.log(`Global average rating: ${globalAverage}`)

    // Step 2: Get all recipes that need rating updates
    const recipes = await prisma.globalRecipe.findMany({
      select: {
        id: true,
        title: true,
        ratingCount: true,
        ratingSum: true,
        rating: true,
        weightedRating: true,
      },
    })

    console.log(`Processing ${recipes.length} recipes...`)

    // Step 3: Calculate weighted ratings for each recipe
    const updateResults = []

    for (const recipe of recipes) {
      const v = recipe.ratingCount || 0 // number of votes
      const R = v > 0 ? (recipe.ratingSum || 0) / v : 0 // average rating
      const m = MINIMUM_VOTES // minimum votes threshold
      const C = globalAverage // global average

      // Weighted rating formula: (v × R + m × C) ÷ (v + m)
      const weightedRating = v > 0 ? (v * R + m * C) / (v + m) : 0
      const roundedWeightedRating = Math.round(weightedRating * 100) / 100

      // Update the recipe
      await prisma.globalRecipe.update({
        where: { id: recipe.id },
        data: {
          weightedRating: roundedWeightedRating,
          lastRatingUpdate: new Date(),
        },
      })

      updateResults.push({
        id: recipe.id,
        title: recipe.title,
        oldData: {
          rating: recipe.rating,
          ratingCount: recipe.ratingCount,
          ratingSum: recipe.ratingSum,
          weightedRating: recipe.weightedRating,
        },
        newData: {
          votes: v,
          averageRating: Math.round(R * 100) / 100,
          weightedRating: roundedWeightedRating,
        },
        calculation: {
          formula: `(${v} × ${Math.round(R * 100) / 100} + ${m} × ${globalAverage}) ÷ (${v} + ${m})`,
          result: `${roundedWeightedRating}`,
        },
      })
    }

    console.log("Manual rating batch update completed successfully")

    return NextResponse.json({
      success: true,
      message: "Manual rating batch update completed",
      summary: {
        recipesProcessed: recipes.length,
        globalAverage: Math.round(globalAverage * 100) / 100,
        minimumVotesThreshold: MINIMUM_VOTES,
        updateTime: new Date().toISOString(),
      },
      detailedResults: updateResults,
    })
  } catch (error) {
    console.error("Manual batch rating update error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
