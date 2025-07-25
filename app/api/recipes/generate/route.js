import { checkUser } from "@/lib/checkUser";
import { generateRecipe } from "@/lib/gemini";
import { generateRecipeImage } from "@/lib/image-generator";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Check if user is authenticated
    const user = await checkUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate recipe using Gemini AI
    const recipeData = await generateRecipe(prompt);

    // Generate image for the recipe
    console.log("Generating image for recipe:", recipeData.title);
    const recipeImage = await generateRecipeImage(
      recipeData.title,
      recipeData.description
    );
    console.log("Generated image URL:", recipeImage);

    // Save to user_recipes table with image
    const userRecipe = await prisma.userRecipe.create({
      data: {
        userId: user.id,
        title: recipeData.title,
        description: recipeData.description,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        tags: recipeData.tags,
        nutrition: recipeData.nutrition,
        image: recipeImage, // Add the generated image
      },
    });

    // Also save to global_recipes table with image
    await prisma.globalRecipe.create({
      data: {
        userId: user.id,
        title: recipeData.title,
        description: recipeData.description,
        prepTime: recipeData.prepTime,
        cookTime: recipeData.cookTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        tags: recipeData.tags,
        nutrition: recipeData.nutrition,
        cuisine: recipeData.cuisine || "International",
        image: recipeImage, // Add the generated image
      },
    });


    return NextResponse.json({
      success: true,
      recipe: {
        id: userRecipe.id,
        ...recipeData,
        image: recipeImage, // Include image in response
      },
    });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
