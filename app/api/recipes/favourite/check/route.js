import { checkUser } from "@/lib/checkUser"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { recipeIds } = await request.json()

    if (!recipeIds || !Array.isArray(recipeIds)) {
      return NextResponse.json({ success: false, error: "Recipe IDs array is required" }, { status: 400 })
    }

    // Get user's favorite recipes from the provided recipe IDs
    const favoriteRecipes = await prisma.userRecipe.findMany({
      where: {
        userId: user.id,
        isFavorite: true,
        id: {
          in: recipeIds,
        },
      },
      select: {
        id: true,
      },
    })

    // Also check global recipes that might be favorited
    const favoriteGlobalRecipes = await prisma.globalRecipe.findMany({
      where: {
        id: {
          in: recipeIds,
        },
      },
      select: {
        id: true,
        title: true,
      },
    })

    // Check if any of these global recipes have been saved as user favorites
    const savedFavorites = await prisma.userRecipe.findMany({
      where: {
        userId: user.id,
        isFavorite: true,
        title: {
          in: favoriteGlobalRecipes.map((recipe) => recipe.title),
        },
      },
      select: {
        title: true,
      },
    })

    // Map back to global recipe IDs
    const savedFavoriteIds = favoriteGlobalRecipes
      .filter((globalRecipe) => savedFavorites.some((saved) => saved.title === globalRecipe.title))
      .map((recipe) => recipe.id)

    const allFavoriteIds = [...favoriteRecipes.map((recipe) => recipe.id), ...savedFavoriteIds]

    return NextResponse.json({
      success: true,
      favorites: allFavoriteIds,
    })
  } catch (error) {
    console.error("Check favorites error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
