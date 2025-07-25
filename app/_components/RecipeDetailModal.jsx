"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, Star, Share2, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import RecipeImage from "./ReceiptImage";
import StarRating from "./StarRating";
import RatingDisplay from "./RatingDisplay";

export default function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
  showAuthor = false,
  allowImageRegeneration = false,
  showRating = true, // ✅ new prop
}) {
  const [isFavorited, setIsFavorited] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(recipe?.image);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const [currentRating, setCurrentRating] = useState(
    recipe?.weightedRating || recipe?.rating || 0
  );
  const [currentRatingCount, setCurrentRatingCount] = useState(
    recipe?.ratingCount || 0
  );

  if (!recipe) return null;

  const handleImageRegenerate = async () => {
    if (!recipe.id) return;

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
      setImageLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: shareUrl,
        });
      } catch (error) {
        // Sharing was canceled or failed — optional logging
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Recipe link copied to clipboard",
          variant: "success",
        });
      } catch (err) {
        console.error("Clipboard write failed:", err);
        toast({
          title: "Copy failed",
          description: "Could not copy link to clipboard",
          variant: "error",
        });
      }
    }
  };

  //   const handleDownload = () => {
  //     const content = `
  // ${recipe.title}

  // Description: ${recipe.description}

  // Prep Time: ${recipe.prepTime}
  // Cook Time: ${recipe.cookTime}
  // Servings: ${recipe.servings}
  // Difficulty: ${recipe.difficulty}

  // Ingredients:
  // ${
  //   recipe.ingredients?.map((ing) => `• ${ing}`).join("\n") ||
  //   "No ingredients listed"
  // }

  // Instructions:
  // ${
  //   recipe.instructions?.map((inst, idx) => `${idx + 1}. ${inst}`).join("\n") ||
  //   "No instructions listed"
  // }

  // Nutrition (per serving):
  // • Calories: ${recipe.nutrition?.calories || "N/A"}
  // • Protein: ${recipe.nutrition?.protein || "N/A"}g
  // • Carbs: ${recipe.nutrition?.carbs || "N/A"}g
  // • Fat: ${recipe.nutrition?.fat || "N/A"}g
  // • Fiber: ${recipe.nutrition?.fiber || "N/A"}g

  // Tags: ${recipe.tags?.join(", ") || "None"}
  //     `.trim();

  //     const blob = new Blob([content], { type: "text/plain" });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${recipe.title
  //       .replace(/[^a-z0-9]/gi, "_")
  //       .toLowerCase()}.txt`;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   };

  const handleDownload = async () => {
    if (!recipe?.id) return;

    try {
      setIsDownloading(true);

      const response = await fetch("/api/recipes/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: recipe.id,
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
          description: "Recipe downloaded successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to download recipe",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error downloading recipe:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    // Update local state to reflect the new rating
    setCurrentRatingCount((prev) => prev + 1);
    // This is a simplified update - in a real app you'd refetch the recipe data
    toast({
      title: "Thank you!",
      description: "Your rating has been recorded.",
      variant: "success",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Image with Regeneration */}
          <RecipeImage
            src={currentImage || recipe.image}
            alt={recipe.title}
            className="w-full h-64 rounded-lg overflow-hidden"
            onRegenerate={
              allowImageRegeneration ? handleImageRegenerate : undefined
            }
            allowRegeneration={allowImageRegeneration}
            isRegenerating={imageLoading}
            fallbackText={recipe.title}
          />

          {/* Recipe Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ChefHat className="h-4 w-4" />
              <span>{recipe.difficulty}</span>
            </div>
            {showRating && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RatingDisplay
                  weightedRating={currentRating}
                  ratingCount={currentRatingCount}
                  size="md"
                  showCount={true}
                  showText={true}
                />
              </div>
            )}
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
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
          {/* Interactive Rating Section */}
          {showRating && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3">Rate this Recipe</h4>
              <StarRating
                recipeId={recipe.id}
                size="lg"
                onRatingChange={handleRatingChange}
              />
              <p className="text-sm text-gray-600 mt-2">
                Share your experience with this recipe! Your rating helps others
                discover great dishes.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{recipe.description}</p>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              )) || <p className="text-gray-500">No ingredients listed</p>}
            </ul>
          </div>

          <Separator />

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <ol className="space-y-3">
              {recipe.instructions?.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{instruction}</span>
                </li>
              )) || <p className="text-gray-500">No instructions listed</p>}
            </ol>
          </div>

          {/* Nutrition Info */}
          {recipe.nutrition && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Nutrition (per serving)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">
                      {recipe.nutrition.calories || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {recipe.nutrition.protein || "N/A"}g
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {recipe.nutrition.carbs || "N/A"}g
                    </div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">
                      {recipe.nutrition.fat || "N/A"}g
                    </div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">
                      {recipe.nutrition.fiber || "N/A"}g
                    </div>
                    <div className="text-sm text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Author Info */}
          {showAuthor && recipe.user && (
            <>
              <Separator />
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={
                    recipe.user.imageUrl ||
                    "/placeholder.svg?height=40&width=40&text=User"
                  }
                  alt="Author"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">
                    {recipe.user.firstName || ""} {recipe.user.lastName || ""}
                  </p>
                  <p className="text-sm text-gray-600">Recipe Author</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
