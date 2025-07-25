"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Calculator,
  Apple,
  Plus,
  X,
  Download,
  PieChart,
  BarChart3,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

export default function NutritionCalculator() {
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", unit: "g" },
  ]);
  const [recipeText, setRecipeText] = useState("");
  const [servings, setServings] = useState("1");
  const [nutritionData, setNutritionData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const { toast } = useToast();

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "g" }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const calculateNutrition = async () => {
    setIsCalculating(true);
    try {
      let payload = {};

      if (activeTab === "ingredients") {
        const validIngredients = ingredients
          .filter((ing) => ing.name.trim() !== "")
          .map((ing) => {
            if (ing.amount && ing.unit) {
              return `${ing.amount} ${ing.unit} ${ing.name}`;
            }
            return ing.name;
          });

        if (validIngredients.length === 0) {
          toast({
            title: "Error",
            description: "Please add at least one ingredient",
            variant: "error",
          });
          setIsCalculating(false);
          return;
        }

        payload = {
          ingredients: validIngredients,
          servings: Number.parseInt(servings) || 1,
        };
      } else {
        if (!recipeText.trim()) {
          toast({
            title: "Error",
            description: "Please enter a recipe",
            variant: "error",
          });
          setIsCalculating(false);
          return;
        }

        payload = {
          recipeText,
          servings: Number.parseInt(servings) || 1,
        };
      }

      const response = await fetch("/api/nutrition/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setNutritionData(data.nutrition);
        toast({
          title: "Success!",
          description: "Nutrition calculated successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to calculate nutrition",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error calculating nutrition:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const downloadNutritionHTML = async () => {
    if (!nutritionData) return;

    try {
      setIsDownloading(true);

      const response = await fetch("/api/nutrition/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nutritionData,
          ingredients:
            activeTab === "ingredients"
              ? ingredients
                  .filter((ing) => ing.name.trim() !== "")
                  .map((ing) => {
                    if (ing.amount && ing.unit) {
                      return `${ing.amount} ${ing.unit} ${ing.name}`;
                    }
                    return ing.name;
                  })
              : [],
          recipeText: activeTab === "recipe" ? recipeText : "",
          format: "html",
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
          description: "Nutrition analysis downloaded successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to download nutrition analysis",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error downloading nutrition analysis:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  const NutritionCard = ({
    title,
    data,
    unit = "",
    showProgress = false,
    color = "bg-blue-500",
  }) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span className="text-sm font-semibold">
                  {value.amount}
                  {value.unit || unit}
                  {value.dailyValue && (
                    <span className="text-gray-500 ml-1">
                      ({value.dailyValue}% DV)
                    </span>
                  )}
                </span>
              </div>
              {showProgress && value.percentage && (
                <Progress value={value.percentage} className={`h-2 ${color}`} />
              )}
              {value.dailyValue && (
                <Progress
                  value={value.dailyValue}
                  className={`h-2 mt-1 ${color}`}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nutrition Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate detailed nutrition information for recipes and individual
            ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-blue-500" />
                Calculate Nutrition
              </CardTitle>
              <CardDescription>
                Add ingredients or paste a recipe to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">By Ingredients</TabsTrigger>
                  <TabsTrigger value="recipe">Full Recipe</TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Ingredients List
                    </Label>
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) =>
                            updateIngredient(index, "name", e.target.value)
                          }
                          className="col-span-6"
                        />
                        <Input
                          placeholder="Amount"
                          type="number"
                          value={ingredient.amount}
                          onChange={(e) =>
                            updateIngredient(index, "amount", e.target.value)
                          }
                          className="col-span-3"
                        />
                        <select
                          value={ingredient.unit}
                          onChange={(e) =>
                            updateIngredient(index, "unit", e.target.value)
                          }
                          className="col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="l">l</option>
                          <option value="cup">cup</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="piece">piece</option>
                          <option value="oz">oz</option>
                          <option value="lb">lb</option>
                        </select>
                        {ingredients.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            className="col-span-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addIngredient}
                      className="w-full mt-2 bg-transparent"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="recipe" className="space-y-4">
                  <div>
                    <Label
                      htmlFor="recipe-text"
                      className="text-sm font-medium text-gray-700 mb-2 block"
                    >
                      Recipe Text
                    </Label>
                    <Textarea
                      id="recipe-text"
                      placeholder="Paste your recipe here... (ingredients and quantities will be automatically extracted)"
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                      value={recipeText}
                      onChange={(e) => setRecipeText(e.target.value)}
                      rows={6}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <Label
                  htmlFor="servings"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Number of Servings
                </Label>
                <Input
                  id="servings"
                  type="number"
                  placeholder="e.g., 4"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button
                onClick={calculateNutrition}
                disabled={isCalculating}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Nutrition
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {nutritionData ? (
              <>
                {/* Calories Overview */}
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                      {nutritionData.totalCalories}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Total Calories{" "}
                      {nutritionData.servings > 1
                        ? `(${nutritionData.servings} servings)`
                        : ""}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* AI Insights Box */}
                {nutritionData.insights && (
                  <Card className="shadow-lg border-l-4 border-l-blue-500 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Lightbulb className="h-5 w-5" />
                        AI Nutritional Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-blue-700">
                        {nutritionData.insights.summary && (
                          <p className="italic">
                            {nutritionData.insights.summary}
                          </p>
                        )}

                        {nutritionData.insights.strengths &&
                          nutritionData.insights.strengths.length > 0 && (
                            <div>
                              <p className="font-medium text-green-700">
                                Nutritional Strengths:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-green-700 ml-2">
                                {nutritionData.insights.strengths.map(
                                  (strength, index) => (
                                    <li key={index}>{strength}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {nutritionData.insights.considerations &&
                          nutritionData.insights.considerations.length > 0 && (
                            <div>
                              <p className="font-medium text-amber-700">
                                Considerations:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700 ml-2">
                                {nutritionData.insights.considerations.map(
                                  (consideration, index) => (
                                    <li key={index}>{consideration}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {nutritionData.insights.healthTips &&
                          nutritionData.insights.healthTips.length > 0 && (
                            <div>
                              <p className="font-medium text-blue-700">
                                Health Tips:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                                {nutritionData.insights.healthTips.map(
                                  (tip, index) => (
                                    <li key={index}>{tip}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Macronutrients */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="shadow-lg md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-blue-500" />
                        Macronutrients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {nutritionData.macros && (
                        <div className="space-y-4">
                          {/* Macro distribution visualization */}
                          <div className="flex justify-center mb-4">
                            <div className="relative w-32 h-32">
                              {/* Simplified pie chart representation */}
                              <div
                                className="absolute inset-0 rounded-full bg-blue-500"
                                style={{
                                  clipPath: `polygon(50% 50%, 50% 0%, ${
                                    50 +
                                    50 *
                                      Math.cos(
                                        (Math.PI *
                                          2 *
                                          nutritionData.macros.protein
                                            .percentage) /
                                          100
                                      )
                                  }% ${
                                    50 -
                                    50 *
                                      Math.sin(
                                        (Math.PI *
                                          2 *
                                          nutritionData.macros.protein
                                            .percentage) /
                                          100
                                      )
                                  }%, 50% 50%)`,
                                }}
                              ></div>
                              <div
                                className="absolute inset-0 rounded-full bg-green-500"
                                style={{
                                  clipPath: `polygon(50% 50%, ${
                                    50 +
                                    50 *
                                      Math.cos(
                                        (Math.PI *
                                          2 *
                                          nutritionData.macros.protein
                                            .percentage) /
                                          100
                                      )
                                  }% ${
                                    50 -
                                    50 *
                                      Math.sin(
                                        (Math.PI *
                                          2 *
                                          nutritionData.macros.protein
                                            .percentage) /
                                          100
                                      )
                                  }%, ${
                                    50 +
                                    50 *
                                      Math.cos(
                                        (Math.PI *
                                          2 *
                                          (nutritionData.macros.protein
                                            .percentage +
                                            nutritionData.macros.carbs
                                              .percentage)) /
                                          100
                                      )
                                  }% ${
                                    50 -
                                    50 *
                                      Math.sin(
                                        (Math.PI *
                                          2 *
                                          (nutritionData.macros.protein
                                            .percentage +
                                            nutritionData.macros.carbs
                                              .percentage)) /
                                          100
                                      )
                                  }%, 50% 50%)`,
                                }}
                              ></div>
                              <div
                                className="absolute inset-0 rounded-full bg-orange-500"
                                style={{
                                  clipPath: `polygon(50% 50%, ${
                                    50 +
                                    50 *
                                      Math.cos(
                                        (Math.PI *
                                          2 *
                                          (nutritionData.macros.protein
                                            .percentage +
                                            nutritionData.macros.carbs
                                              .percentage)) /
                                          100
                                      )
                                  }% ${
                                    50 -
                                    50 *
                                      Math.sin(
                                        (Math.PI *
                                          2 *
                                          (nutritionData.macros.protein
                                            .percentage +
                                            nutritionData.macros.carbs
                                              .percentage)) /
                                          100
                                      )
                                  }%, 100% 50%, 50% 50%)`,
                                }}
                              ></div>
                            </div>
                          </div>

                          {/* Macro legend */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                              <div className="text-sm font-medium">Protein</div>
                              <div className="text-xs text-gray-600">
                                {nutritionData.macros.protein.amount}g (
                                {nutritionData.macros.protein.percentage}%)
                              </div>
                            </div>
                            <div>
                              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                              <div className="text-sm font-medium">Carbs</div>
                              <div className="text-xs text-gray-600">
                                {nutritionData.macros.carbs.amount}g (
                                {nutritionData.macros.carbs.percentage}%)
                              </div>
                            </div>
                            <div>
                              <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-1"></div>
                              <div className="text-sm font-medium">Fat</div>
                              <div className="text-xs text-gray-600">
                                {nutritionData.macros.fat.amount}g (
                                {nutritionData.macros.fat.percentage}%)
                              </div>
                            </div>
                          </div>

                          {/* Daily values */}
                          <div className="pt-4 border-t">
                            <div className="text-sm font-medium mb-2">
                              % Daily Values
                            </div>
                            <div className="space-y-2">
                              {nutritionData.macros.protein.dailyValue && (
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Protein</span>
                                    <span>
                                      {nutritionData.macros.protein.dailyValue}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      nutritionData.macros.protein.dailyValue
                                    }
                                    className="h-1.5 bg-gray-200"
                                    // indicatorClassName="bg-blue-500"
                                  />
                                </div>
                              )}
                              {nutritionData.macros.carbs.dailyValue && (
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Carbs</span>
                                    <span>
                                      {nutritionData.macros.carbs.dailyValue}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      nutritionData.macros.carbs.dailyValue
                                    }
                                    className="h-1.5 bg-gray-200"
                                    // indicatorClassName="bg-green-500"
                                  />
                                </div>
                              )}
                              {nutritionData.macros.fat.dailyValue && (
                                <div>
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Fat</span>
                                    <span>
                                      {nutritionData.macros.fat.dailyValue}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={nutritionData.macros.fat.dailyValue}
                                    className="h-1.5 bg-gray-200"
                                    // indicatorClassName="bg-orange-500"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        Other Nutrients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {nutritionData.macros &&
                          Object.entries(nutritionData.macros).map(
                            ([key, value]) => {
                              if (
                                key === "protein" ||
                                key === "carbs" ||
                                key === "fat"
                              )
                                return null;

                              return (
                                <div key={key}>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="font-medium">
                                      {value.amount}
                                      {value.unit}
                                      {value.dailyValue && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({value.dailyValue}%)
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  {value.dailyValue && (
                                    <Progress
                                      value={value.dailyValue}
                                      className="h-1.5 mt-1 bg-gray-200"
                                    />
                                  )}
                                </div>
                              );
                            }
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Vitamins & Minerals Tabs */}
                <Card className="shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle>Micronutrients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="vitamins">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
                        <TabsTrigger value="minerals">Minerals</TabsTrigger>
                      </TabsList>

                      <TabsContent value="vitamins" className="space-y-4">
                        {nutritionData.vitamins &&
                        Object.entries(nutritionData.vitamins).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(nutritionData.vitamins).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="text-sm">
                                      {value.amount}
                                      {value.unit}
                                      {value.dailyValue && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({value.dailyValue}% DV)
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  {value.dailyValue && (
                                    <Progress
                                      value={value.dailyValue}
                                      className="h-1.5 bg-gray-200"
                                      // indicatorClassName="bg-green-500"
                                    />
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No vitamin data available
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="minerals" className="space-y-4">
                        {nutritionData.minerals &&
                        Object.entries(nutritionData.minerals).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(nutritionData.minerals).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="border rounded-lg p-3"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="text-sm">
                                      {value.amount}
                                      {value.unit}
                                      {value.dailyValue && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({value.dailyValue}% DV)
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  {value.dailyValue && (
                                    <Progress
                                      value={value.dailyValue}
                                      className="h-1.5 bg-gray-200"
                                      // indicatorClassName="bg-purple-500"
                                    />
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No mineral data available
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={downloadNutritionHTML}
                    disabled={isDownloading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium mb-1">Disclaimer:</p>
                  <p>
                    This nutrition analysis is an estimate based on standard
                    food composition databases and AI calculations. Actual
                    values may vary based on specific brands, preparation
                    methods, and portion sizes. This information is not intended
                    to replace professional medical advice.
                  </p>
                </div>
              </>
            ) : (
              <Card className="shadow-lg h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Calculator className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Add ingredients or paste a recipe to see detailed
                      nutrition analysis!
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
