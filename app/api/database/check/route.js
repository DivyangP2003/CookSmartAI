import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if tables exist and what columns they have
    const tableInfo = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('global_recipes', 'recipe_ratings', 'users')
      ORDER BY table_name, column_name;
    `

    // Check if we can query basic recipe data
    const recipeCount = await prisma.globalRecipe.count()

    // Check if user table exists and has data
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      tableInfo,
      counts: {
        recipes: recipeCount,
        users: userCount,
      },
      message: "Database check completed successfully",
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Database check failed - this helps identify the issue",
      },
      { status: 500 },
    )
  }
}
