import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const cuisine = searchParams.get("cuisine")
    const diet = searchParams.get("diet")
    const search = searchParams.get("search")
    const user = searchParams.get("user")
    const difficulty = searchParams.get("difficulty")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const where = {}

    // Filter by cuisine
    if (cuisine && cuisine !== "All Cuisines") {
      where.cuisine = cuisine
    }

    // Filter by diet (check tags array)
    if (diet && diet !== "All Diets") {
      where.tags = {
        has: diet,
      }
    }

    // Filter by difficulty
    if (difficulty && difficulty !== "All Difficulties") {
      where.difficulty = difficulty
    }

    const andConditions = []
    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { cuisine: { contains: search, mode: "insensitive" } },
          { tags: { hasSome: [search] } },
        ],
      })
    }

    if (user) {
      andConditions.push({
        user: {
          OR: [
            { firstName: { contains: user, mode: "insensitive" } },
            { lastName: { contains: user, mode: "insensitive" } },
          ],
        },
      })
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    // Try to fetch recipes with rating fields, fallback if they don't exist
    let recipes
    try {
      recipes = await prisma.globalRecipe.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
        orderBy: [{ weightedRating: "desc" }, { ratingCount: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      })
    } catch (error) {
      console.log("Rating fields not available, using fallback query:", error.message)
      // Fallback query without rating fields
      recipes = await prisma.globalRecipe.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
        orderBy: [{ rating: "desc" }, { viewCount: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      })

      // Add default rating fields to each recipe
      recipes = recipes.map((recipe) => ({
        ...recipe,
        ratingCount: 0,
        ratingSum: 0,
        weightedRating: recipe.rating || 0,
      }))
    }

    // Get total count for pagination
    const total = await prisma.globalRecipe.count({ where })

    // Get available cuisines for filter
    const cuisines = await prisma.globalRecipe.findMany({
      select: { cuisine: true },
      distinct: ["cuisine"],
      orderBy: { cuisine: "asc" },
    })

    // Get available diet types from tags
    const allTags = await prisma.globalRecipe.findMany({
      select: { tags: true },
    })

    const dietTypes = [
      ...new Set(
        allTags
          .flatMap((recipe) => recipe.tags)
          .filter((tag) =>
            ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Low-Carb", "Mediterranean"].includes(
              tag,
            ),
          ),
      ),
    ].sort()

    return NextResponse.json({
      success: true,
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        cuisines: cuisines.map((c) => c.cuisine).filter(Boolean),
        dietTypes,
        difficulties: ["Easy", "Medium", "Hard"],
      },
    })
  } catch (error) {
    console.error("Get global recipes error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
