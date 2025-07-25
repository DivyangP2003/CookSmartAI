import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function runRatingUpdate() {
  console.log("Starting daily rating batch update...");

  const MINIMUM_VOTES = 5;

  const globalStats = await prisma.globalRecipe.aggregate({
    where: {
      ratingCount: {
        gte: MINIMUM_VOTES,
      },
    },
    _avg: {
      rating: true,
    },
  });

  const globalAverage = globalStats._avg.rating || 3.0;
  console.log(`Global average rating: ${globalAverage}`);

  const recipes = await prisma.globalRecipe.findMany({
    where: {
      ratingCount: {
        gt: 0,
      },
    },
    select: {
      id: true,
      ratingCount: true,
      ratingSum: true,
      rating: true,
    },
  });

  console.log(`Updating ${recipes.length} recipes...`);

  const updatePromises = recipes.map(async (recipe) => {
    const v = recipe.ratingCount;
    const R = recipe.ratingSum / recipe.ratingCount;
    const m = MINIMUM_VOTES;
    const C = globalAverage;

    const weightedRating = (v * R + m * C) / (v + m);

    return prisma.globalRecipe.update({
      where: { id: recipe.id },
      data: {
        weightedRating: Math.round(weightedRating * 100) / 100,
        lastRatingUpdate: new Date(),
      },
    });
  });

  await Promise.all(updatePromises);

  console.log("Daily rating batch update completed successfully");

  return NextResponse.json({
    success: true,
    message: "Rating batch update completed",
    recipesUpdated: recipes.length,
    globalAverage,
  });
}

// GET endpoint for Vercel cron job
export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    return await runRatingUpdate();
  } catch (error) {
    console.error("Batch rating update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
