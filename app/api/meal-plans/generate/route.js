import { checkUser } from "@/lib/checkUser"
import { generateMealPlan, generateMealPlanInsights } from "@/lib/gemini"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await request.json()
    if (!preferences) {
      return NextResponse.json({ success: false, error: "Preferences are required" }, { status: 400 })
    }

    // Generate meal plan using Gemini AI with location data
    const mealPlanData = await generateMealPlan(preferences)

    // Generate AI insights with location context
    const aiInsights = await generateMealPlanInsights(mealPlanData, preferences)

    // Calculate date range
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + Number.parseInt(preferences.days || 7))

    // Save to user_meal_plans table with location data
    const userMealPlan = await prisma.userMealPlan.create({
      data: {
        userId: user.id,
        title: preferences.title || `${preferences.days || 7}-Day Meal Plan`,
        startDate,
        endDate,
        days: mealPlanData.days,
        totalCalories: mealPlanData.totalCalories,
        shoppingList: mealPlanData.shoppingList,
        preferences: {
          ...preferences,
          location: preferences.location || null, // Store location data
        },
        aiInsights: aiInsights, // Store AI insights
      },
    })

    return NextResponse.json({
      success: true,
      mealPlan: {
        id: userMealPlan.id,
        ...mealPlanData,
      },
      aiInsights,
    })
  } catch (error) {
    console.error("Meal plan generation error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
