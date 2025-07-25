import { seedRecipes } from "@/scripts/seed-recipes";

export async function GET() {
    const result = await seedRecipes()
    return Response.json(result)

}