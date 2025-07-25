"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Clock,
  Users,
  Calendar,
  ChefHat,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/app/_components/ui/use-toast";
import RecipeDetailModal from "@/app/_components/RecipeDetailModal";
import MealPlanDetailModal from "@/app/_components/MealPlanModal";
import RecipeImage from "@/app/_components/ReceiptImage";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState({ recipes: [], mealPlans: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isMealPlanModalOpen, setIsMealPlanModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/favourites");
      const data = await response.json();

      if (data.success) {
        setFavorites(data.favorites);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch favorites",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id, type) => {
    try {
      const endpoint =
        type === "recipe" ? "/api/recipes/save" : "/api/meal-plans/save";
      const body = type === "recipe" ? { recipeId: id } : { mealPlanId: id };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        // Update the UI by removing the item
        if (type === "recipe") {
          setFavorites((prev) => ({
            ...prev,
            recipes: prev.recipes.filter((recipe) => recipe.id !== id),
          }));
        } else {
          setFavorites((prev) => ({
            ...prev,
            mealPlans: prev.mealPlans.filter((plan) => plan.id !== id),
          }));
        }

        toast({
          title: "Success!",
          description: data.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to remove favorite",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    }
  };

  const handleImageRegenerate = async (recipeId) => {
    setImageLoading((prev) => ({ ...prev, [recipeId]: true }));

    try {
      const response = await fetch("/api/recipes/regenerate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the recipe image in the favorites list
        setFavorites((prev) => ({
          ...prev,
          recipes: prev.recipes.map((recipe) =>
            recipe.id === recipeId ? { ...recipe, image: data.image } : recipe
          ),
        }));

        toast({
          title: "Success!",
          description: "Recipe image regenerated!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to regenerate image",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setImageLoading((prev) => ({ ...prev, [recipeId]: false }));
    }
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleViewMealPlan = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setIsMealPlanModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Favourites
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your saved recipes and meal plans in one place
          </p>
        </div>

        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Favorite Recipes ({favorites.recipes.length})
            </TabsTrigger>
            <TabsTrigger value="meal-plans" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meal Plans ({favorites.mealPlans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            {favorites.recipes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Favorite Recipes Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start generating recipes and save your favorites!
                  </p>
                  <Link href="/recipe-generator">
                    <Button className="bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white">
                      Generate Recipe
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.recipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="hover:shadow-lg transition-shadow relative overflow-hidden"
                  >
                    {/* Recipe Image */}
                    <RecipeImage
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48"
                      onRegenerate={() => handleImageRegenerate(recipe.id)}
                      allowRegeneration={true}
                      isRegenerating={imageLoading[recipe.id]}
                      fallbackText={recipe.title}
                    />

                    {/* Favorite Heart */}
                    <div className="absolute top-4 left-4 z-10">
                      <Heart className="h-5 w-5 text-pink-500 fill-pink-500 bg-white/90 backdrop-blur-sm rounded-full p-1" />
                    </div>

                    <CardHeader>
                      <div className="flex justify-between items-start pr-8">
                        <CardTitle className="text-lg">
                          {recipe.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(recipe.id, "recipe")}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{recipe.prepTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{recipe.servings}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {recipe.difficulty}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.tags?.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {recipe.tags?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{recipe.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => handleViewRecipe(recipe)}
                        className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Recipe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="meal-plans">
            {favorites.mealPlans.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Saved Meal Plans Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create meal plans and save your favorites!
                  </p>
                  <Link href="/meal-planner">
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                      Create Meal Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.mealPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="hover:shadow-lg transition-shadow relative"
                  >
                    {/* Favorite Heart - Always Pink for Favorites Page */}
                    <div className="absolute top-4 right-4 z-10">
                      <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start pr-8">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(plan.id, "meal-plan")}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        {new Date(plan.startDate).toLocaleDateString()} -{" "}
                        {new Date(plan.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {plan.days?.length || 0} days
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Calories:</span>
                          <span className="font-medium">
                            {plan.totalCalories?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleViewMealPlan(plan)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Meal Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Recipe Detail Modal */}
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={isRecipeModalOpen}
          onClose={() => {
            setIsRecipeModalOpen(false);
            setSelectedRecipe(null);
          }}
          showAuthor={false}
          allowImageRegeneration={true}
          showRating={false} // 👈 Disable rating display + section
        />

        {/* Meal Plan Detail Modal */}
        <MealPlanDetailModal
          mealPlan={selectedMealPlan}
          isOpen={isMealPlanModalOpen}
          onClose={() => {
            setIsMealPlanModalOpen(false);
            setSelectedMealPlan(null);
          }}
        />
      </div>
    </div>
  );
}
