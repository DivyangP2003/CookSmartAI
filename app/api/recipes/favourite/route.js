import { checkUser } from "@/lib/checkUser"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { recipeId } = await request.json()

    if (!recipeId) {
      return NextResponse.json({ success: false, error: "Recipe ID is required" }, { status: 400 })
    }

    // First, check if this is a global recipe
    const globalRecipe = await prisma.globalRecipe.findUnique({
      where: { id: recipeId },
    })

    if (globalRecipe) {
      // Check if user already has this recipe saved as favorite
      const existingUserRecipe = await prisma.userRecipe.findFirst({
        where: {
          userId: user.id,
          title: globalRecipe.title,
        },
      })

      if (existingUserRecipe) {
        // Toggle favorite status
        const updatedRecipe = await prisma.userRecipe.update({
          where: { id: existingUserRecipe.id },
          data: { isFavorite: !existingUserRecipe.isFavorite },
        })

        return NextResponse.json({
          success: true,
          isFavorite: updatedRecipe.isFavorite,
          message: updatedRecipe.isFavorite ? "Recipe added to favorites!" : "Recipe removed from favorites!",
        })
      } else {
        // Create new user recipe as favorite
        await prisma.userRecipe.create({
          data: {
            userId: user.id,
            title: globalRecipe.title,
            description: globalRecipe.description,
            prepTime: globalRecipe.prepTime,
            cookTime: globalRecipe.cookTime,
            servings: globalRecipe.servings,
            difficulty: globalRecipe.difficulty,
            ingredients: globalRecipe.ingredients,
            instructions: globalRecipe.instructions,
            tags: globalRecipe.tags,
            nutrition: globalRecipe.nutrition,
            image: globalRecipe.image,
            isFavorite: true,
          },
        })

        return NextResponse.json({
          success: true,
          isFavorite: true,
          message: "Recipe added to favorites!",
        })
      }
    } else {
      // Handle user recipe
      const userRecipe = await prisma.userRecipe.findFirst({
        where: {
          id: recipeId,
          userId: user.id,
        },
      })

      if (!userRecipe) {
        return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 })
      }

      const updatedRecipe = await prisma.userRecipe.update({
        where: { id: recipeId },
        data: { isFavorite: !userRecipe.isFavorite },
      })

      return NextResponse.json({
        success: true,
        isFavorite: updatedRecipe.isFavorite,
        message: updatedRecipe.isFavorite ? "Recipe added to favorites!" : "Recipe removed from favorites!",
      })
    }
  } catch (error) {
    console.error("Toggle favorite error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
