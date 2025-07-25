"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  Share2,
  Download,
  Loader2,
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function MealPlanDetailModal({ mealPlan, isOpen, onClose }) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!mealPlan) return null;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: mealPlan.title,
        text: `Check out this meal plan: ${mealPlan.title}`,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Meal plan link copied to clipboard",
        variant: "success",
      });
    }
  };

  const handleDownload = async () => {
    if (!mealPlan?.id) return;

    try {
      setIsDownloading(true);

      const response = await fetch("/api/meal-plans/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mealPlanId: mealPlan.id,
          format: "html",
          preferences: {
            days: mealPlan.days?.length || 0,
            servings: 1, // Default servings
            budget: null,
            dietaryPreferences: [],
            allergies: [],
          },
          aiInsights: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Create and download HTML file
        const blob = new Blob([data.htmlContent], { type: "text/html" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Success!",
          description: "Meal plan downloaded successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to download meal plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading meal plan:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {mealPlan.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meal Plan Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{mealPlan.days?.length || 0} days</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Utensils className="h-4 w-4" />
              <span>
                {mealPlan.totalCalories?.toLocaleString() || "N/A"} cal
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(mealPlan.startDate).toLocaleDateString()} -{" "}
                {new Date(mealPlan.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                Created {new Date(mealPlan.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-transparent"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Daily Meal Plans */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Daily Meal Plan</h3>
            <div className="space-y-6">
              {mealPlan.days?.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      Day {dayIndex + 1}
                    </h4>
                    <Badge variant="outline">
                      {new Date(day.date).toLocaleDateString()}
                    </Badge>
                  </div>

                  {Array.isArray(day.meals) && day.meals.length > 0 ? (
                    <div className="space-y-4">
                      {day.meals.map((meal, mealIndex) => (
                        <div
                          key={mealIndex}
                          className="bg-white border rounded-lg p-4 shadow-sm"
                        >
                          {/* Header Row: Type + Calories */}
                          <div className="flex justify-between items-center mb-2">
                            <Badge
                              variant={
                                meal.type === "Breakfast"
                                  ? "default"
                                  : meal.type === "Lunch"
                                  ? "secondary"
                                  : meal.type === "Dinner"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {meal.type}
                            </Badge>
                            {meal.calories && (
                              <span className="text-sm text-gray-600 font-medium">
                                {meal.calories} cal
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h5 className="font-medium text-gray-900 mb-1">
                            {meal.recipe?.title || meal.name || "Unnamed Meal"}
                          </h5>

                          {/* Description (optional) */}
                          {meal.recipe?.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {meal.recipe.description}
                            </p>
                          )}

                          {/* Optional Extras: Time / Servings */}
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            {meal.prepTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meal.prepTime}
                              </span>
                            )}
                            {meal.recipe?.servings && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meal.recipe.servings}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No meals planned for this day
                    </p>
                  )}
                </div>
              )) || (
                <p className="text-gray-500 text-center py-8">
                  No daily meal plans available
                </p>
              )}
            </div>
          </div>

          {/* Nutrition Summary */}
          {mealPlan.totalCalories && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Nutrition Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">
                    <div className="text-2xl font-bold">
                      {mealPlan.totalCalories.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-90">Total Calories</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round(
                        mealPlan.totalCalories / (mealPlan.days?.length || 1)
                      )}
                    </div>
                    <div className="text-sm opacity-90">Avg Daily Calories</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                    <div className="text-2xl font-bold">
                      {mealPlan.days?.reduce(
                        (total, day) =>
                          total +
                          (Array.isArray(day.meals) ? day.meals.length : 0),
                        0
                      ) || 0}
                    </div>
                    <div className="text-sm opacity-90">Total Meals</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg">
                    <div className="text-2xl font-bold">
                      {mealPlan.days?.length || 0}
                    </div>
                    <div className="text-sm opacity-90">Days Planned</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Author Info */}
          {mealPlan.author && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {mealPlan.author.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">
                    {mealPlan.author.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-600">Meal Plan Creator</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
