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

    // Find the recipe
    const recipe = await prisma.userRecipe.findFirst({
      where: {
        id: recipeId,
        userId: user.id,
      },
    })

    if (!recipe) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 })
    }

    // Toggle favorite status
    const updatedRecipe = await prisma.userRecipe.update({
      where: { id: recipeId },
      data: { isFavorite: !recipe.isFavorite },
    })

    return NextResponse.json({
      success: true,
      message: updatedRecipe.isFavorite ? "Recipe saved to favorites!" : "Recipe removed from favorites",
      isFavorite: updatedRecipe.isFavorite,
    })
  } catch (error) {
    console.error("Save recipe error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
