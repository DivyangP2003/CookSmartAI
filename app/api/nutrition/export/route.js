import { checkUser } from "@/lib/checkUser"
import { generateNutritionHTML } from "@/lib/htmlnutritionGenerator"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const user = await checkUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { nutritionData, ingredients = [], recipeText = "", format = "html" } = await request.json()

    if (!nutritionData) {
      return NextResponse.json({ success: false, error: "Nutrition data is required" }, { status: 400 })
    }

    if (format === "html") {
      // Generate HTML content
      const htmlContent = generateNutritionHTML(nutritionData, { ingredients, recipeText }, user)

      // Create filename with current date
      const date = new Date().toISOString().split("T")[0]
      const filename = `nutrition-analysis-${date}.html`

      return NextResponse.json({
        success: true,
        htmlContent,
        filename,
        mimeType: "text/html",
      })
    } else {
      // Fallback for other formats (keep existing logic if any)
      return NextResponse.json(
        {
          success: false,
          error: "Format not supported",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Export nutrition error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
