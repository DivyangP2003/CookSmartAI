import { checkUser } from "@/lib/checkUser";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get favorite recipes
    const favoriteRecipes = await prisma.userRecipe.findMany({
      where: {
        userId: user.id,
        isFavorite: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // Get favorite meal plans
    const favoriteMealPlansRaw = await prisma.userMealPlan.findMany({
      where: {
        userId: user.id,
        isFavorite: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // Capitalize utility
    const capitalize = (str) =>
      typeof str === "string"
        ? str.charAt(0).toUpperCase() + str.slice(1)
        : str;

    // Normalize meal plan `days`
    const favoriteMealPlans = favoriteMealPlansRaw.map((plan) => {
      let days = [];

      try {
        const rawDays = Array.isArray(plan.days) ? plan.days : [];

        days = rawDays.map((dayObj) => {
          const mealEntries = dayObj?.meals ? Object.entries(dayObj.meals) : [];

          // Try to build a valid ISO date
          let parsedDate = new Date();
          if (dayObj?.date) {
            const tryDate = new Date(
              `${dayObj.date} ${new Date().getFullYear()}`
            );
            if (!isNaN(tryDate)) parsedDate = tryDate;
          }

          return {
            date: parsedDate.toISOString(),
            meals: mealEntries
              .map(([type, meal]) => ({
                type: capitalize(type),
                ...meal,
              }))
              .sort((a, b) => {
                const order = ["Breakfast", "Lunch", "Snack", "Dinner"];
                return order.indexOf(a.type) - order.indexOf(b.type);
              }),
          };
        });
      } catch (e) {
        console.error("Malformed days in meal plan:", plan.id, e);
      }

      return {
        ...plan,
        days,
      };
    });

    return NextResponse.json({
      success: true,
      favorites: {
        recipes: favoriteRecipes,
        mealPlans: favoriteMealPlans,
      },
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
