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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChefHat,
  Clock,
  Users,
  Sparkles,
  Plus,
  X,
  Heart,
  Share2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";
import RecipeImage from "@/app/_components/ReceiptImage";
import ShareOptionsModal from "./_components/share-options-modal";
import RecommendationPrompts from "./_components/recommendation-prompts";

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState([""]);
  const [freeText, setFreeText] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [imageLoading, setImageLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState(null);
  const { toast } = useToast();

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const generateRecipe = async () => {
    setIsGenerating(true);
    try {
      let prompt = "";
      if (activeTab === "ingredients") {
        const validIngredients = ingredients.filter((ing) => ing.trim() !== "");
        if (validIngredients.length === 0) {
          toast({
            title: "Error",
            description: "Please add at least one ingredient",
            variant: "error",
          });
          return;
        }
        prompt = `Create a recipe using these ingredients: ${validIngredients.join(
          ", "
        )}`;
      } else {
        if (!freeText.trim()) {
          toast({
            title: "Error",
            description: "Please describe your recipe idea",
            variant: "error",
          });
          return;
        }
        prompt = freeText;
      }

      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Recipe generated with image:", data.recipe.image);
        setGeneratedRecipe(data.recipe);
        toast({
          title: "Success!",
          description: "Recipe generated successfully!",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate recipe",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateImage = async () => {
    if (!generatedRecipe?.id) return;

    setImageLoading(true);
    try {
      const response = await fetch("/api/recipes/regenerate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: generatedRecipe.id }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("New image generated:", data.image);
        setGeneratedRecipe((prev) => ({ ...prev, image: data.image }));
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

  const saveRecipe = async () => {
    if (!generatedRecipe?.id) return;

    try {
      const response = await fetch("/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: generatedRecipe.id }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "success",
        });
        setIsFavorite(data.isFavorite); // <-- Update local favorite state

        setGeneratedRecipe((prev) => ({
          ...prev,
          isFavorite: data.isFavorite,
        }));
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save recipe",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    }
  };

  const shareRecipe = async () => {
    if (!generatedRecipe?.id) return;

    try {
      const response = await fetch("/api/recipes/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: generatedRecipe.id,
          recipeImage: generatedRecipe.image, // Add this line
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShareContent({
          ...data.shareContent,
          recipeImage: generatedRecipe.image, // Ensure image is included
        });
        setShareModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to share recipe",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-4 rounded-full">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Recipe Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ingredients or cooking ideas into delicious recipes
            with the power of AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                Generate Your Recipe
              </CardTitle>
              <CardDescription>
                Choose how you'd like to create your recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">
                    From Ingredients
                  </TabsTrigger>
                  <TabsTrigger value="text">From Description</TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Available Ingredients
                    </label>
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="e.g., chicken breast, tomatoes, garlic"
                          value={ingredient}
                          onChange={(e) =>
                            updateIngredient(index, e.target.value)
                          }
                          className="flex-1"
                        />
                        {ingredients.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeIngredient(index)}
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

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Describe Your Recipe Idea
                    </label>
                    <Textarea
                      placeholder="e.g., I want a healthy pasta dish with vegetables that's quick to make for dinner..."
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <RecommendationPrompts
                    isVisible={activeTab === "text"}
                    onPromptSelect={(prompt) => setFreeText(prompt)}
                  />
                </TabsContent>
              </Tabs>

              <Button
                onClick={generateRecipe}
                disabled={isGenerating}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Recipe Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generated Recipe</CardTitle>
              <CardDescription>
                Your AI-generated recipe will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedRecipe ? (
                <div className="space-y-6">
                  {/* Recipe Image */}
                  <RecipeImage
                    src={generatedRecipe.image}
                    alt={generatedRecipe.title}
                    className="w-full h-48 rounded-lg overflow-hidden"
                    onRegenerate={regenerateImage}
                    allowRegeneration={true}
                    isRegenerating={imageLoading}
                    fallbackText={generatedRecipe.title}
                  />
                  {/* Recipe Header */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {generatedRecipe.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {generatedRecipe.description}
                    </p>

                    {/* Recipe Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-sm font-medium">Prep Time</div>
                        <div className="text-sm text-gray-600">
                          {generatedRecipe.prepTime}
                        </div>
                      </div>
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <div className="text-sm font-medium">Cook Time</div>
                        <div className="text-sm text-gray-600">
                          {generatedRecipe.cookTime}
                        </div>
                      </div>
                      <div className="text-center">
                        <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                        <div className="text-sm font-medium">Servings</div>
                        <div className="text-sm text-gray-600">
                          {generatedRecipe.servings}
                        </div>
                      </div>
                      <div className="text-center">
                        <ChefHat className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-sm font-medium">Difficulty</div>
                        <div className="text-sm text-gray-600">
                          {generatedRecipe.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {generatedRecipe.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Ingredients</h4>
                    <ul className="space-y-2">
                      {generatedRecipe.ingredients?.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Instructions</h4>
                    <ol className="space-y-3">
                      {generatedRecipe.instructions?.map(
                        (instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{instruction}</span>
                          </li>
                        )
                      )}
                    </ol>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={saveRecipe}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white"
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 transition-colors duration-300 ${
                          isFavorite
                            ? "text-pink-500 fill-pink-500"
                            : "text-white"
                        }`}
                      />
                      Save Recipe
                    </Button>
                    <Button
                      onClick={shareRecipe}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Recipe
                    </Button>
                    <ShareOptionsModal
                      isOpen={shareModalOpen}
                      onClose={() => setShareModalOpen(false)}
                      shareContent={shareContent}
                      recipeTitle={generatedRecipe?.title}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Enter your ingredients or recipe idea and click "Generate
                    Recipe" to get started!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
