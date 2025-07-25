import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// This endpoint will be called by a cron job daily at 2 AM
export async function POST(request) {
  try {
    // Verify this is called by authorized source (you can add API key check here)
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    console.log("Starting daily rating batch update...")

    // Step 1: Calculate global average rating for recipes with minimum threshold
    const MINIMUM_VOTES = 5
    const globalStats = await prisma.globalRecipe.aggregate({
      where: {
        ratingCount: {
          gte: MINIMUM_VOTES,
        },
      },
      _avg: {
        rating: true,
      },
    })

    const globalAverage = globalStats._avg.rating || 3.0
    console.log(`Global average rating: ${globalAverage}`)

    // Step 2: Get all recipes that need rating updates
    const recipes = await prisma.globalRecipe.findMany({
      where: {
        ratingCount: {
          gt: 0,
        },
      },
      select: {
        id: true,
        ratingCount: true,
        ratingSum: true,
        rating: true,
      },
    })

    console.log(`Updating ${recipes.length} recipes...`)

    // Step 3: Calculate weighted ratings for each recipe
    const updatePromises = recipes.map(async (recipe) => {
      const v = recipe.ratingCount // number of votes
      const R = recipe.ratingSum / recipe.ratingCount // average rating
      const m = MINIMUM_VOTES // minimum votes threshold
      const C = globalAverage // global average

      // Weighted rating formula: (v × R + m × C) ÷ (v + m)
      const weightedRating = (v * R + m * C) / (v + m)

      return prisma.globalRecipe.update({
        where: { id: recipe.id },
        data: {
          weightedRating: Math.round(weightedRating * 100) / 100, // Round to 2 decimal places
          lastRatingUpdate: new Date(),
        },
      })
    })

    // Execute all updates
    await Promise.all(updatePromises)

    console.log("Daily rating batch update completed successfully")

    return NextResponse.json({
      success: true,
      message: "Rating batch update completed",
      recipesUpdated: recipes.length,
      globalAverage,
    })
  } catch (error) {
    console.error("Batch rating update error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
