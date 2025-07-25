import { checkUser } from "@/lib/checkUser"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { mealPlanId } = await request.json()
    if (!mealPlanId) {
      return NextResponse.json({ success: false, error: "Meal Plan ID is required" }, { status: 400 })
    }

    const mealPlan = await prisma.userMealPlan.findFirst({
      where: {
        id: mealPlanId,
        userId: user.id,
      },
    })

    if (!mealPlan) {
      return NextResponse.json({ success: false, error: "Meal plan not found" }, { status: 404 })
    }

    const updatedMealPlan = await prisma.userMealPlan.update({
      where: { id: mealPlanId },
      data: { isFavorite: !mealPlan.isFavorite },
    })

    return NextResponse.json({
      success: true,
      message: updatedMealPlan.isFavorite ? "Meal plan saved to favorites!" : "Meal plan removed from favorites",
      isFavorite: updatedMealPlan.isFavorite,
    })
  } catch (error) {
    console.error("Save meal plan error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
