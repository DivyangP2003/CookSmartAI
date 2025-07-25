import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    let topRecipes

    try {
      // Try to fetch with rating fields
      topRecipes = await prisma.globalRecipe.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
        orderBy: [{ weightedRating: "desc" }, { ratingCount: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }],
        take: 8,
      })
    } catch (error) {
      console.log("Rating fields not available, using fallback query:", error.message)
      // Fallback query without rating fields
      topRecipes = await prisma.globalRecipe.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
        orderBy: [{ rating: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }],
        take: 8,
      })

      // Add default rating fields to each recipe
      topRecipes = topRecipes.map((recipe) => ({
        ...recipe,
        ratingCount: 0,
        ratingSum: 0,
        weightedRating: recipe.rating || 0,
      }))
    }

    return NextResponse.json({
      success: true,
      recipes: topRecipes,
    })
  } catch (error) {
    console.error("Get top recipes error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
