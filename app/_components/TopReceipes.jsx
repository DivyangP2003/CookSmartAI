"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, ChefHat, RefreshCw } from "lucide-react";
import { useToast } from "./ui/use-toast";
import RecipeDetailModal from "./RecipeDetailModal";
import RecipeImage from "./ReceiptImage";
import RatingDisplay from "./RatingDisplay";

export default function TopRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchTopRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes/top");
      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch recipes",
          variant: "destructive",
          variant:"success"
        });
      }
    } catch (error) {
      console.error("Error fetching top recipes:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRecipes();
  }, []);

  const handleRecipeView = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top Trending Recipes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No recipes available yet. Be the first to create and share amazing
              recipes!
            </p>
          </div>

          <div className="text-center">
            <Link href="/recipe-generator">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold"
              >
                <ChefHat className="mr-2 h-5 w-5" />
                Create First Recipe
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Top Trending Recipes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular and highly-rated recipes loved by our
            community of home cooks
          </p>
        </div>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg cursor-pointer"
            >
              <div className="relative">
                <RecipeImage
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48"
                  allowRegeneration={false}
                  fallbackText={recipe.title}
                />

                {/* Top Right Star */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                  >
                    <Star className="h-4 w-4 text-orange-500 fill-yellow-500" />
                  </Button>
                </div>

                {/* Top Left Rating */}
                {(recipe.weightedRating > 0 || recipe.ratingCount > 0) && (
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <RatingDisplay
                        weightedRating={recipe.weightedRating || recipe.rating}
                        ratingCount={recipe.ratingCount}
                        size="sm"
                        showCount={false}
                        showText={true}
                      />
                    </div>
                  </div>
                )}

                {/* Bottom Left Cuisine */}
                {recipe.cuisine && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-black/70 text-white backdrop-blur-sm">
                      {recipe.cuisine}
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {recipe.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {recipe.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Time and Servings */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                {/* Full Rating */}
                <div className="mb-3">
                  <RatingDisplay
                    weightedRating={recipe.weightedRating || recipe.rating}
                    ratingCount={recipe.ratingCount}
                    size="sm"
                    showCount={true}
                    showText={true}
                  />
                </div>

                {/* Difficulty and Calories */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      recipe.difficulty === "Easy"
                        ? "default"
                        : recipe.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {recipe.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {recipe.nutrition?.calories || 0} cal
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags?.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Author */}
                {recipe.user && (
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <img
                      src={
                        recipe.user.imageUrl ||
                        "/placeholder.svg?height=20&width=20&text=User"
                      }
                      alt={`${recipe.user.firstName} ${recipe.user.lastName}`}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>
                      by {recipe.user.firstName} {recipe.user.lastName}
                    </span>
                  </div>
                )}

                {/* View Recipe Button */}
                <Button
                  onClick={() => handleRecipeView(recipe)}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm"
                >
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recipe Detail Modal */}
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showAuthor={true}
          allowImageRegeneration={false}
        />

        {/* Explore More Button */}
        <div className="text-center">
          <Link href="/explore">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold"
            >
              <ChefHat className="mr-2 h-5 w-5" />
              Explore More Recipes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
