import { checkUser } from "@/lib/checkUser";
import { calculateDetailedNutrition } from "@/lib/gemini";
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

    const {
      ingredients = [],
      recipeText = "",
      servings = 1,
    } = await request.json();

    if (
      (!ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0) &&
      !recipeText
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Either ingredients or recipe text must be provided",
        },
        { status: 400 }
      );
    }

    // Calculate nutrition using Gemini AI
    const nutritionData = await calculateDetailedNutrition(
      ingredients,
      recipeText,
      servings
    );

    // If servings were provided, adjust the nutrition data
    if (servings && servings > 1) {
      nutritionData.servings = servings;
    }

    return NextResponse.json({
      success: true,
      nutrition: nutritionData,
    });
  } catch (error) {
    console.error("Nutrition calculation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
