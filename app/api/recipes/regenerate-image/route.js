
import { checkUser } from "@/lib/checkUser"
import { generateRecipeImage, generateStyledRecipeImage } from "@/lib/image-generator"
import { prisma } from "@/lib/prisma"

import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { recipeId, style } = await request.json()
    if (!recipeId) {
      return NextResponse.json({ success: false, error: "Recipe ID is required" }, { status: 400 })
    }

    // Get the recipe
    const recipe = await prisma.userRecipe.findFirst({
      where: {
        id: recipeId,
        userId: user.id,
      },
    })

    if (!recipe) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 })
    }

    // Generate new image
    const newImage = style
      ? await generateStyledRecipeImage(recipe.title, style)
      : await generateRecipeImage(recipe.title, recipe.description)

    // Update both user and global recipes
    await prisma.userRecipe.update({
      where: { id: recipeId },
      data: { image: newImage },
    })

    await prisma.globalRecipe.updateMany({
      where: {
        userId: user.id,
        title: recipe.title,
      },
      data: { image: newImage },
    })

    return NextResponse.json({
      success: true,
      image: newImage,
      message: "Recipe image regenerated successfully!",
    })
  } catch (error) {
    console.error("Image regeneration error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
