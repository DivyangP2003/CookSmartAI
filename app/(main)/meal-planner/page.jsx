"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Sparkles,
  Heart,
  Download,
  Lightbulb,
  MapPin,
  Globe,
  Apple,
  Carrot,
  Fish,
  Beef,
  Wheat,
  Milk,
  Loader2,
} from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";

export default function MealPlanner() {
  const [planDays, setPlanDays] = useState("7");
  const [servings, setServings] = useState("2");
  const [budget, setBudget] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [locationData, setLocationData] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    // Load location data from localStorage
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocationData(JSON.parse(storedLocation));
    }
  }, []);
  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
    "Mediterranean",
  ];

  const handleDietaryChange = (option, checked) => {
    if (checked) {
      setDietaryPreferences([...dietaryPreferences, option]);
    } else {
      setDietaryPreferences(
        dietaryPreferences.filter((pref) => pref !== option)
      );
    }
  };

  const generateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const preferences = {
        days: planDays,
        servings: Number.parseInt(servings),
        budget: budget ? Number.parseFloat(budget) : null,
        dietaryPreferences,
        allergies: allergies
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        title: `${planDays}-Day Meal Plan`,
        location: locationData, // Include location data
      };

      const response = await fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success) {
        setMealPlan(data.mealPlan);
        setAiInsights(data.aiInsights);
        toast({
          title: "Success!",
          description: locationData
            ? `Meal plan generated with ${locationData.city} local cuisine!`
            : "Meal plan generated successfully!",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate meal plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveMealPlan = async () => {
    if (!mealPlan?.id) return;

    try {
      const response = await fetch("/api/meal-plans/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mealPlanId: mealPlan.id }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "default",
        });
        setIsFavorite(data.isFavorite);
        setMealPlan((prev) => ({ ...prev, isFavorite: data.isFavorite }));
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save meal plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadMealPlan = async () => {
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
            days: planDays,
            servings: servings,
            budget: budget,
            dietaryPreferences: dietaryPreferences,
            allergies: allergies
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a),
            location: locationData,
          },
          aiInsights: aiInsights,
        }),
      });
      const data = await response.json();

      if (data.success) {
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
          variant: "default",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Meal Planner & Scheduler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create personalized meal plans tailored to your preferences and
            schedule {locationData && "with local cuisine recommendations"}
          </p>

          {/* Location Display */}
          {locationData && (
            <div className="mt-6">
              <Card className="max-w-md mx-auto border-green-200 bg-green-50">
                <CardContent className="text-center py-4">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">
                      Local Cuisine & Timing Enabled
                    </span>{" "}
                  </div>
                  <p className="text-sm text-green-700">
                    {locationData.city}, {locationData.state},{" "}
                    {locationData.country}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Meal plans with local food styles, ingredients & meal
                    timings
                  </p>
                  {locationData.timezone && (
                    <p className="text-xs text-green-600">
                      Timezone: {locationData.timezone}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planning Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                Plan Your Meals
              </CardTitle>
              <CardDescription>
                Customize your meal plan preferences
                {locationData && " with local cuisine integration"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Duration */}
              <div>
                <Label htmlFor="days">Planning Duration</Label>
                <Select value={planDays} onValueChange={setPlanDays}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="7">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Servings */}
              <div>
                <Label htmlFor="servings">Number of People</Label>
                <Select value={servings} onValueChange={setServings}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select servings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="3">3 People</SelectItem>
                    <SelectItem value="4">4 People</SelectItem>
                    <SelectItem value="5">5 People</SelectItem>
                    <SelectItem value="6">6 People</SelectItem>
                    <SelectItem value="8">8 People</SelectItem>
                    <SelectItem value="10">10 People</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div>
                <Label htmlFor="budget">Weekly Budget (Optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 150"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              {/* Dietary Preferences */}
              <div>
                <Label className="text-base font-medium">
                  Dietary Preferences
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {dietaryOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={dietaryPreferences.includes(option)}
                        onCheckedChange={(checked) =>
                          handleDietaryChange(option, checked)
                        }
                      />
                      <Label htmlFor={option} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <Label htmlFor="allergies">Allergies/Restrictions</Label>
                <Input
                  id="allergies"
                  placeholder="e.g., nuts, shellfish, dairy"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple allergies with commas
                </p>
              </div>

              <Button
                onClick={generateMealPlan}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    {locationData
                      ? "Generate Local Meal Plan"
                      : "Generate Meal Plan"}
                  </>
                )}
              </Button>

              {!locationData && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Want local cuisine recommendations?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/")}
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Enable Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meal Plan Display */}
          <div className="lg:col-span-2">
            {mealPlan ? (
              <div className="space-y-6">
                {/* AI Insights Box */}
                {aiInsights && (
                  <Card className="shadow-lg border-l-4 border-l-blue-500 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Lightbulb className="h-5 w-5" />
                        AI Insights
                        {locationData && (
                          <Badge variant="secondary" className="ml-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            Local Cuisine & Timing
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-blue-700">
                        <p>
                          <strong>Why this plan works for you:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {aiInsights.benefits?.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                        {aiInsights.nutritionalHighlights && (
                          <div>
                            <p className="font-medium mt-3">
                              Nutritional Highlights:
                            </p>
                            <p className="text-sm">
                              {aiInsights.nutritionalHighlights}
                            </p>
                          </div>
                        )}
                        {aiInsights.localCuisineInsights && (
                          <div>
                            <p className="font-medium mt-3">
                              Local Cuisine Integration:
                            </p>
                            <p className="text-sm">
                              {aiInsights.localCuisineInsights}
                            </p>
                          </div>
                        )}
                        {aiInsights.mealTimingAnalysis && (
                          <div>
                            <p className="font-medium mt-3">
                              Meal Timing Analysis:
                            </p>
                            <p className="text-sm">
                              {aiInsights.mealTimingAnalysis}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Plan Overview */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Your Meal Plan
                          {locationData && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-300"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              {locationData.city}
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {planDays} {planDays === "1" ? "day" : "days"} •{" "}
                          {mealPlan.totalCalories?.toLocaleString() || "N/A"}{" "}
                          total calories
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={saveMealPlan}
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Heart
                            className={`h-4 w-4 mr-2 transition-colors duration-300 ${
                              isFavorite
                                ? "text-pink-500 fill-pink-500"
                                : "text-white stroke-black stroke-2"
                            }`}
                          />
                          Save
                        </Button>
                        <Button
                          onClick={downloadMealPlan}
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Downloading
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {dietaryPreferences.map((pref) => (
                        <Badge key={pref} variant="secondary">
                          {pref}
                        </Badge>
                      ))}
                      {servings && (
                        <Badge variant="outline">
                          {servings}{" "}
                          {Number.parseInt(servings) === 1
                            ? "Person"
                            : "People"}
                        </Badge>
                      )}
                      {budget && (
                        <Badge variant="outline">${budget} Budget</Badge>
                      )}
                      {locationData && (
                        <Badge variant="outline" className="text-green-600">
                          <Globe className="h-3 w-3 mr-1" />
                          Local Cuisine
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Meal Plans */}
                {mealPlan.days?.map((day, index) => (
                  <Card key={index} className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{day.day}</span>
                        <span className="text-sm text-gray-500">
                          {day.date}
                        </span>
                      </CardTitle>
                      {day.culturalInsight && locationData && (
                        <CardDescription className="text-green-700 bg-green-50 p-2 rounded text-sm">
                          <Globe className="h-3 w-3 inline mr-1" />
                          {day.culturalInsight}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(day.meals || {}).map(
                          ([mealType, meal]) => (
                            <div
                              key={mealType}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold capitalize text-gray-900">
                                  {mealType}
                                </h4>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {meal.time}
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2 font-medium">
                                {meal.name}
                              </p>
                              <div className="text-sm text-gray-500 mb-2">
                                {meal.calories} calories
                              </div>
                              {meal.culturalNote && locationData && (
                                <p className="text-xs text-green-600 bg-green-50 p-1 rounded">
                                  {meal.culturalNote}
                                </p>
                              )}
                              {meal.localCuisine && (
                                <Badge
                                  variant="outline"
                                  className="mt-2 text-xs text-green-600 border-green-300"
                                >
                                  <Globe className="h-3 w-3 mr-1" />
                                  Local Style
                                </Badge>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Shopping List */}
                {mealPlan.shoppingList && mealPlan.shoppingList.length > 0 && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Shopping List</CardTitle>
                      <CardDescription>
                        Everything you need for your meal plan
                        {locationData && " with local ingredients"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mealPlan.shoppingList.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button
                          onClick={saveMealPlan}
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                        >
                          <Heart
                            className={`h-4 w-4 mr-2 transition-colors duration-300 ${
                              isFavorite
                                ? "text-pink-500 fill-pink-500"
                                : "text-white"
                            }`}
                          />
                          Save Plan
                        </Button>
                        <Button
                          onClick={downloadMealPlan}
                          variant="outline"
                          className="flex-1 bg-transparent"
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Downloading
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="shadow-lg h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Configure your preferences and generate your personalized
                      meal plan
                      {locationData && " with local cuisine recommendations"}!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
