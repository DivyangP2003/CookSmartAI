"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Play, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/app/_components/ui/use-toast"

export default function RatingUpdatePage() {
  const [updateResult, setUpdateResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const runManualUpdate = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/recipes/manual-batch-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setUpdateResult(data)
        toast({
          title: "Success!",
          description: `Updated ${data.summary.recipesProcessed} recipes`,
          variant:"success"
          })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update ratings",
          variant: "error",
        })
      }
    } catch (error) {
      console.error("Error running manual update:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
              <RefreshCw className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rating Batch Update</h1>
          <p className="text-xl text-gray-600">Manually trigger weighted rating calculations</p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              Manual Update Control
            </CardTitle>
            <CardDescription>
              Normally runs automatically at 2:00 AM daily. Use this for testing or immediate updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={runManualUpdate}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating Ratings...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Manual Update
                  </>
                )}
              </Button>

              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Automatic updates: Daily at 2:00 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Results */}
        {updateResult && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Update Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{updateResult.summary.recipesProcessed}</div>
                    <div className="text-sm text-gray-600">Recipes Updated</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{updateResult.summary.globalAverage}</div>
                    <div className="text-sm text-gray-600">Global Average</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {updateResult.summary.minimumVotesThreshold}
                    </div>
                    <div className="text-sm text-gray-600">Min Votes Threshold</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {new Date(updateResult.summary.updateTime).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-gray-600">Update Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Recipe Updates</CardTitle>
                <CardDescription>See how each recipe's weighted rating was calculated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {updateResult.detailedResults.map((recipe, index) => (
                    <div key={recipe.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{recipe.title}</h4>
                        <Badge variant="outline">Recipe #{index + 1}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Old Data */}
                        <div>
                          <h5 className="font-medium text-red-600 mb-2">📊 Before Update</h5>
                          <div className="text-sm space-y-1">
                            <div>Rating: {recipe.oldData.rating || "N/A"}</div>
                            <div>Count: {recipe.oldData.ratingCount || 0}</div>
                            <div>Sum: {recipe.oldData.ratingSum || 0}</div>
                            <div>Weighted: {recipe.oldData.weightedRating || "N/A"}</div>
                          </div>
                        </div>

                        {/* New Data */}
                        <div>
                          <h5 className="font-medium text-green-600 mb-2">✅ After Update</h5>
                          <div className="text-sm space-y-1">
                            <div>Votes: {recipe.newData.votes}</div>
                            <div>Average: {recipe.newData.averageRating}</div>
                            <div>
                              Weighted: <strong>{recipe.newData.weightedRating}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Calculation */}
                        <div>
                          <h5 className="font-medium text-blue-600 mb-2">🧮 Calculation</h5>
                          <div className="text-sm">
                            <div className="font-mono text-xs bg-white p-2 rounded border">
                              {recipe.calculation.formula}
                            </div>
                            <div className="mt-1">
                              = <strong>{recipe.calculation.result}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              How Weighted Rating Updates Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-600">🕐 Automatic Schedule</h4>
                <p className="text-gray-600">
                  The system automatically runs this update every day at 2:00 AM using a cron job. This ensures all
                  weighted ratings stay current.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-green-600">📊 What Gets Updated</h4>
                <ul className="text-gray-600 list-disc list-inside space-y-1">
                  <li>Calculates global average rating across all recipes</li>
                  <li>Updates each recipe's weighted rating using Bayesian average</li>
                  <li>Sets lastRatingUpdate timestamp</li>
                  <li>Ensures fair ranking regardless of vote count</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-600">🔧 Manual Updates</h4>
                <p className="text-gray-600">
                  Use the manual update button above for testing or when you want immediate results after adding new
                  ratings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-yellow-600">⚡ Real-time vs Batch</h4>
                <p className="text-gray-600">
                  Individual ratings update immediately when submitted, but weighted ratings are calculated in batches
                  for better performance and consistency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
