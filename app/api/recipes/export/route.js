import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";
import { prisma } from "@/lib/prisma";
import { generateRecipeHTML } from "@/lib/htmlRecipeGenerator";

export async function POST(request) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recipeId } = await request.json();
    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: "Recipe ID is required" },
        { status: 400 }
      );
    }
    let recipe = null;
    let recipeType = null;

    // First, try UserRecipe
    recipe = await prisma.userRecipe.findFirst({
      where: {
        id: recipeId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    });

    if (recipe) {
      recipeType = "user";
    } else {
      // Try GlobalRecipe if not found in UserRecipe
      recipe = await prisma.globalRecipe.findFirst({
        where: {
          id: recipeId,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
      });

      if (recipe) {
        recipeType = "global";
      }
    }

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }
    // Generate HTML content
    const htmlContent = generateRecipeHTML({ recipe }, user);

    // Create filename with current date
    const date = new Date().toISOString().split("T")[0];
    const safeTitle = recipe.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `${safeTitle}-recipe-${date}.html`;

    return NextResponse.json({
      success: true,
      htmlContent,
      filename,
      mimeType: "text/html",
    });
  } catch (error) {
    console.error("Export recipe error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
