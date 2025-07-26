import { checkUser } from "@/lib/checkUser";
import { generateRecipe } from "@/lib/gemini";
import { generateRecipeImage } from "@/lib/image-generator";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Read body only once
    const requestBody = await request.json();
    const { prompt, location } = requestBody;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // ✅ Use location directly
    const locationData = location || null;

    // Generate recipe using Gemini AI with location and time context
    const recipeData = await generateRecipe(prompt, locationData);

    console.log("Generating image for recipe:", recipeData.title);
    const recipeImage = await generateRecipeImage(
      recipeData.title,
      recipeData.description
    );
    console.log("Generated image URL:", recipeImage);

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
        image: recipeImage,
        mealType: recipeData.mealType || null,
        localAdaptation: recipeData.localAdaptation || null,
        timeAppropriate: recipeData.timeAppropriate || null,
        userLocation: locationData || null,
      },
    });

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
        image: recipeImage,
        mealType: recipeData.mealType || null,
        localAdaptation: recipeData.localAdaptation || null,
        userLocation: locationData || null,
      },
    });

    return NextResponse.json({
      success: true,
      recipe: {
        id: userRecipe.id,
        ...recipeData,
        image: recipeImage,
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
