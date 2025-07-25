import { analyzeImageForNutrition, analyzeImageForRecipe } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { image, mode } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    if (!["recipe", "nutrition"].includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Use "recipe" or "nutrition"' },
        { status: 400 }
      );
    }
    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, "");

    let result;
    if (mode === "recipe") {
      result = await analyzeImageForRecipe(base64Image);
    } else if (mode === "nutrition") {
      result = await analyzeImageForNutrition(base64Image);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Use "recipe" or "nutrition"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        type: mode,
        ...result,
      },
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
