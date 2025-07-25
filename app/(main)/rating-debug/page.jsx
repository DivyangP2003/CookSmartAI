"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calculator, Star } from "lucide-react"

export default function RatingDebugPage() {
  const [debugData, setDebugData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDebugData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/recipes/rating-debug")
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      console.error("Error fetching debug data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p>Loading rating calculations...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!debugData?.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-red-600">Error loading rating data: {debugData?.error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rating System Debug</h1>
          <p className="text-xl text-gray-600">Understanding how recipe ratings are calculated</p>
          <Button onClick={fetchDebugData} className="mt-4 bg-transparent" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Global Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Global Rating Statistics</CardTitle>
            <CardDescription>Overall statistics across all recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{debugData.globalStats.totalRecipes}</div>
                <div className="text-sm text-gray-600">Total Recipes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{debugData.globalStats.totalRatings}</div>
                <div className="text-sm text-gray-600">Total Ratings</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {debugData.globalStats.globalAverage.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Global Average</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...Object.values(debugData.globalStats.ratingDistribution))}
                </div>
                <div className="text-sm text-gray-600">Most Common Rating</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = debugData.globalStats.ratingDistribution[rating]
                  const percentage =
                    debugData.globalStats.totalRatings > 0 ? (count / debugData.globalStats.totalRatings) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span>{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-yellow-400 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16">{count} votes</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Recipe Statistics */}
        <div className="space-y-6">
          {debugData.recipeStats.map((recipe, index) => (
            <Card key={recipe.recipeId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{recipe.title}</span>
                  <Badge variant="outline">Recipe #{index + 1}</Badge>
                </CardTitle>
                <CardDescription>Detailed rating calculations for this recipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stored Data */}
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">📊 Stored in Database</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Rating:</span>
                        <span className="font-mono">{recipe.storedData.rating || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating Count:</span>
                        <span className="font-mono">{recipe.storedData.ratingCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating Sum:</span>
                        <span className="font-mono">{recipe.storedData.ratingSum || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weighted Rating:</span>
                        <span className="font-mono">{recipe.storedData.weightedRating || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Data */}
                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">🧮 Calculated from Ratings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Actual Count:</span>
                        <span className="font-mono">{recipe.actualData.actualCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Sum:</span>
                        <span className="font-mono">{recipe.actualData.actualSum}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actual Average:</span>
                        <span className="font-mono">{recipe.actualData.actualAverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calculated Weighted:</span>
                        <span className="font-mono">{recipe.calculatedWeightedRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Ratings */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">👥 Individual Ratings</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ratingsBreakdown.map((rating, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <span>{rating.user}:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rating.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">({rating.rating})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculation Explanation */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📝 How This Recipe's Rating is Calculated:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Basic Average:</strong> {recipe.actualData.actualSum} ÷ {recipe.actualData.actualCount} ={" "}
                      {recipe.actualData.actualAverage}
                    </p>
                    <p>
                      <strong>Weighted Formula:</strong> ({recipe.actualData.actualCount} ×{" "}
                      {recipe.actualData.actualAverage} + 5 × 3.0) ÷ ({recipe.actualData.actualCount} + 5) ={" "}
                      {recipe.calculatedWeightedRating}
                    </p>
                    <p className="text-gray-600 italic">
                      The weighted rating prevents recipes with very few ratings from ranking too high or too low by
                      blending with a global average.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Explanation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🎓 Rating System Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-600">Basic Rating (Simple Average)</h4>
                <p className="text-sm text-gray-600">
                  Sum of all ratings ÷ Number of ratings. For example: (1 + 5) ÷ 2 = 3.0
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600">Weighted Rating (Bayesian Average)</h4>
                <p className="text-sm text-gray-600">
                  Formula: (votes × average + minVotes × globalAverage) ÷ (votes + minVotes)
                  <br />
                  This prevents recipes with very few ratings from dominating the rankings.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-600">Why Use Weighted Ratings?</h4>
                <p className="text-sm text-gray-600">
                  A recipe with one 5-star rating shouldn't rank higher than a recipe with 100 ratings averaging 4.8
                  stars. The weighted system balances this by considering both the rating and the number of votes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
