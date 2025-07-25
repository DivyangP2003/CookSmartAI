import { checkUser } from "@/lib/checkUser";
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

    const { recipeId, rating, viewTime } = await request.json();

    // Validate input
    if (!recipeId || !rating) {
      return NextResponse.json(
        { success: false, error: "Recipe ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if recipe exists
    const recipe = await prisma.globalRecipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Check if user already rated this recipe
    const existingRating = await prisma.recipeRating.findUnique({
      where: {
        recipeId_userId: {
          recipeId,
          userId: user.id,
        },
      },
    });

    let isUpdate = false;
    let oldRating = 0;

    if (existingRating) {
      // Update existing rating
      oldRating = existingRating.rating;
      await prisma.recipeRating.update({
        where: { id: existingRating.id },
        data: {
          rating,
          viewTime: viewTime || 0, // Optional view time
          updatedAt: new Date(),
        },
      });
      isUpdate = true;
    } else {
      // Create new rating
      await prisma.recipeRating.create({
        data: {
          recipeId,
          userId: user.id,
          rating,
          viewTime: viewTime || 0, // Optional view time
        },
      });
    }

    // Update recipe rating statistics
    if (isUpdate) {
      // For updates, adjust the sum
      const newSum = recipe.ratingSum - oldRating + rating;
      await prisma.globalRecipe.update({
        where: { id: recipeId },
        data: {
          ratingSum: newSum,
          rating: recipe.ratingCount > 0 ? newSum / recipe.ratingCount : 0,
        },
      });
    } else {
      // For new ratings, increment count and sum
      const newCount = recipe.ratingCount + 1;
      const newSum = recipe.ratingSum + rating;
      await prisma.globalRecipe.update({
        where: { id: recipeId },
        data: {
          ratingCount: newCount,
          ratingSum: newSum,
          rating: newSum / newCount,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: isUpdate
        ? "Rating updated successfully!"
        : "Rating added successfully!",
      rating,
      isUpdate,
    });
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    // Get user's rating for this recipe
    const userRating = await prisma.recipeRating.findUnique({
      where: {
        recipeId_userId: {
          recipeId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      userRating: userRating?.rating || null,
      hasRated: !!userRating,
    });
  } catch (error) {
    console.error("Get rating error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
