import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser";
import { prisma } from "@/lib/prisma";

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

    // Get the recipe details
    const userRecipe = await prisma.userRecipe.findUnique({
      where: { id: recipeId },
    });

    if (!userRecipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    // Update share status
    await prisma.userRecipe.update({
      where: { id: recipeId },
      data: { isShared: true },
    });

    // Find corresponding global recipe and increment share count
    await prisma.globalRecipe.updateMany({
      where: {
        title: userRecipe.title,
        userId: user.id,
      },
      data: {
        shareCount: { increment: 1 },
      },
    });

    // Generate shareable link
    const shareUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/explore`;

    // Generate dynamic share content
    const shareContent = generateDynamicShareContent(
      userRecipe,
      user,
      shareUrl
    );

    return NextResponse.json({
      success: true,
      message: "Recipe shared successfully!",
      shareUrl,
      shareContent,
    });
  } catch (error) {
    console.error("Share recipe error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to generate dynamic share content
function generateDynamicShareContent(recipe, user, shareUrl) {
  // Extract key ingredients (skip common ones)
  const commonIngredients = [
    "salt",
    "pepper",
    "oil",
    "water",
    "butter",
    "olive oil",
  ];
  const keyIngredients =
    recipe.ingredients
      ?.filter(
        (ingredient) =>
          !commonIngredients.some((common) =>
            ingredient.toLowerCase().includes(common)
          )
      )
      .slice(0, 3)
      .join(", ") || "amazing ingredients";

  // Format prep time
  const formatTime = (time) => {
    if (!time) return "no time";
    return time
      .toLowerCase()
      .replace("minutes", "mins")
      .replace("minute", "min");
  };

  // Get user's first name
  const userName = user.firstName || "I";

  // Generate different message templates
  const templates = {
    casual: `Hey! ${userName} just created this amazing ${
      recipe.title
    } using AI! 🍳 Ready in ${formatTime(
      recipe.prepTime
    )} with ${keyIngredients}. You should totally try it! ✨\n\n${shareUrl}`,

    social: `🍳 Just whipped up this incredible ${recipe.title} in ${formatTime(
      recipe.prepTime
    )}! ✨ Made with AI magic using ${keyIngredients}. Who's hungry? #AIRecipe #CookSmartAI #Cooking\n\n${shareUrl}`,

    family: `Hi everyone! ${userName} found a great ${
      recipe.title
    } recipe that's perfect for dinner. Ready in ${formatTime(
      recipe.prepTime
    )} and features ${keyIngredients}! 👨‍🍳\n\n${shareUrl}`,

    professional: `Excited to share this ${
      recipe.title
    } recipe I developed using CookSmartAI. Features ${keyIngredients} and can be prepared in just ${formatTime(
      recipe.prepTime
    )}. Perfect for ${getDifficultyContext(recipe.difficulty)}!\n\n${shareUrl}`,
  };

  // Generate call-to-actions
  const callToActions = [
    "Try this recipe and let me know how it turns out! 🍽️",
    "Would love to hear your take on this one! 👨‍🍳",
    "Let me know if you make any tweaks to the recipe! ✨",
    "Tag me when you try this - can't wait to see your version! 📸",
    "This one's a keeper - hope you love it as much as I do! ❤️",
  ];

  // Select random call-to-action
  const randomCTA =
    callToActions[Math.floor(Math.random() * callToActions.length)];

  // Generate personalized preview
  const recipePreview = `Check out this amazing ${
    recipe.title
  } ${userName} just created! 🍳 Ready in ${formatTime(
    recipe.prepTime
  )} with ${keyIngredients}. Made with AI ✨`;

  return {
    preview: recipePreview,
    casual: templates.casual,
    social: templates.social,
    family: templates.family,
    professional: templates.professional,
    callToAction: randomCTA,
    shareUrl,
    recipeTitle: recipe.title,
    prepTime: formatTime(recipe.prepTime),
    keyIngredients,
    userName,
  };
}

// Helper function for difficulty context
function getDifficultyContext(difficulty) {
  const contexts = {
    Easy: "busy weeknights",
    Medium: "weekend cooking",
    Hard: "special occasions",
    Beginner: "cooking newcomers",
    Intermediate: "home cooks",
    Advanced: "culinary enthusiasts",
  };
  return contexts[difficulty] || "any occasion";
}
