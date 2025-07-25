"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Heart, Star, ChefHat, RefreshCw } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import RatingDisplay from "./RatingDisplay";

export default function RecipeCard({
  recipe,
  onView,
  onFavoriteToggle,
  isFavorite = false,
  showAuthor = false,
  allowImageRegeneration = false,
}) {
  const [imageLoading, setImageLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(recipe.image);
  const { toast } = useToast();

  const handleImageRegenerate = async (e) => {
    e.stopPropagation();
    setImageLoading(true);

    try {
      const response = await fetch("/api/recipes/regenerate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: recipe.id }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentImage(data.image);
        toast({
          title: "Success!",
          description: "Recipe image regenerated!",
        variant:"success"
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
      setImageLoading(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="relative">
        <img
          src={
            currentImage ||
            `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
              recipe.title
            )}`
          }
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
              recipe.title
            )}`;
          }}
        />

        {/* Image Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {allowImageRegeneration && (
            <Button
              size="icon"
              variant="secondary"
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
              onClick={handleImageRegenerate}
              disabled={imageLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${imageLoading ? "animate-spin" : ""}`}
              />
            </Button>
          )}

          <Button
            size="icon"
            variant="secondary"
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
            onClick={(e) => onFavoriteToggle && onFavoriteToggle(e, recipe.id)}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite
                  ? "text-pink-500 fill-pink-500"
                  : "text-gray-400 hover:text-pink-500"
              }`}
            />
          </Button>
        </div>

        {/* Recipe Info Overlays */}
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-black/70 text-white">
            {recipe.cuisine || "International"}
          </Badge>
        </div>
        {(recipe.weightedRating > 0 || recipe.ratingCount > 0) && (
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
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
        {/* Recipe Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-3 w-3" />
            <span>{recipe.viewCount || 0}</span>
          </div>
        </div>
        {/* Rating Display */}
        <div className="mb-3">
          <RatingDisplay
            weightedRating={recipe.weightedRating || recipe.rating}
            ratingCount={recipe.ratingCount}
            size="sm"
            showCount={true}
            showText={true}
          />
        </div>

        {/* Difficulty and Author */}
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

          {showAuthor && recipe.user && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <img
                src={
                  recipe.user.imageUrl ||
                  "/placeholder.svg?height=20&width=20&text=U"
                }
                alt="Author"
                className="w-4 h-4 rounded-full"
              />
              <span>
                {recipe.user.firstName} {recipe.user.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recipe.tags?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* View Recipe Button */}
        <Button
          onClick={() => onView && onView(recipe)}
          className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white text-sm"
        >
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
}
