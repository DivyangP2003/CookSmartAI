import { checkUser } from "@/lib/checkUser"
import { generateMealPlanHTML } from "@/lib/htmlGenerator"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { mealPlanId, format = "html", preferences, aiInsights } = await request.json()
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

    if (format === "html") {
      // Generate HTML content
      const htmlContent = generateMealPlanHTML({
        mealPlan,
        user,
        preferences,
        aiInsights,
      })

      // Create filename with current date
      const date = new Date().toISOString().split("T")[0]
      const filename = `meal-plan-${date}.html`

      return NextResponse.json({
        success: true,
        htmlContent,
        filename,
        mimeType: "text/html",
      })
    } else if (format === "pdf") {
      // Keep your existing PDF logic as fallback
      return NextResponse.json({
        success: true,
        mealPlanData: {
          mealPlan,
          user,
          preferences,
          aiInsights,
        },
        filename: `meal-plan-${Date.now()}.pdf`,
      })
    } else {
      // Text format fallback
      let content = `Meal Plan - ${mealPlan.title}\n`
      content += `Generated on: ${new Date().toLocaleDateString()}\n\n`
      content += `User: ${user.firstName} ${user.lastName}\n`
      content += `Email: ${user.email}\n\n`

      if (Array.isArray(mealPlan.shoppingList)) {
        content += "Shopping List:\n"
        mealPlan.shoppingList.forEach((item, index) => {
          content += `${index + 1}. ${item}\n`
        })
      }

      content += `\nTotal Estimated Calories: ${mealPlan.totalCalories || "N/A"}\n`
      content += `Duration: ${new Date(mealPlan.startDate).toLocaleDateString()} - ${new Date(mealPlan.endDate).toLocaleDateString()}\n`

      return NextResponse.json({
        success: true,
        content,
        filename: `meal-plan-${Date.now()}.txt`,
      })
    }
  } catch (error) {
    console.error("Export meal plan error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
