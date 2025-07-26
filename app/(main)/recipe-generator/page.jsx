"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Clock, Users, Sparkles, Plus, X, Heart, Share2, MapPin, Globe } from "lucide-react"
import { useToast } from "@/app/_components/ui/use-toast"
import RecommendationPrompts from "./_components/recommendation-prompts"
import RecipeImage from "@/app/_components/ReceiptImage"
import ShareOptionsModal from "./_components/share-options-modal"

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState([""])
  const [freeText, setFreeText] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("ingredients")
  const [imageLoading, setImageLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareContent, setShareContent] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [currentMealType, setCurrentMealType] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load location data from localStorage
    const storedLocation = localStorage.getItem("userLocation")
    if (storedLocation) {
      const location = JSON.parse(storedLocation)
      setLocationData(location)

      // Determine current meal type based on timezone
      if (location.timezone) {
        const now = new Date()
        const timeInTimezone = new Date(now.toLocaleString("en-US", { timeZone: location.timezone }))
        const hour = timeInTimezone.getHours()

        let mealType = ""
        if (hour >= 5 && hour < 10) {
          mealType = "breakfast"
        } else if (hour >= 10 && hour < 12) {
          mealType = "brunch"
        } else if (hour >= 12 && hour < 15) {
          mealType = "lunch"
        } else if (hour >= 15 && hour < 17) {
          mealType = "snack"
        } else if (hour >= 17 && hour < 21) {
          mealType = "dinner"
        } else if (hour >= 21 && hour < 24) {
          mealType = "late dinner"
        } else {
          mealType = "late night snack"
        }

        setCurrentMealType(mealType)
      }
    }
  }, [])

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const generateRecipe = async () => {
    setIsGenerating(true)
    try {
      let prompt = ""
      if (activeTab === "ingredients") {
        const validIngredients = ingredients.filter((ing) => ing.trim() !== "")
        if (validIngredients.length === 0) {
          toast({
            title: "Error",
            description: "Please add at least one ingredient",
            variant: "destructive",
          })
          return
        }
        prompt = `Create a recipe using these ingredients: ${validIngredients.join(", ")}`
      } else {
        if (!freeText.trim()) {
          toast({
            title: "Error",
            description: "Please describe your recipe idea",
            variant: "destructive",
          })
          return
        }
        prompt = freeText
      }

      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          location: locationData, // Send location data to API
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log("Recipe generated with image:", data.recipe.image)
        setGeneratedRecipe(data.recipe)
        toast({
          title: "Success!",
          description: locationData
            ? `${data.recipe.cuisine} recipe generated for ${currentMealType}!`
            : "Recipe generated successfully!",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate recipe",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating recipe:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const regenerateImage = async () => {
    if (!generatedRecipe?.id) return

    setImageLoading(true)
    try {
      const response = await fetch("/api/recipes/regenerate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: generatedRecipe.id }),
      })

      const data = await response.json()

      if (data.success) {
        console.log("New image generated:", data.image)
        setGeneratedRecipe((prev) => ({ ...prev, image: data.image }))
        toast({
          title: "Success!",
          description: "Recipe image regenerated!",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to regenerate image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error regenerating image:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImageLoading(false)
    }
  }

  const saveRecipe = async () => {
    if (!generatedRecipe?.id) return

    try {
      const response = await fetch("/api/recipes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: generatedRecipe.id }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "default",
        })
        setIsFavorite(data.isFavorite)

        setGeneratedRecipe((prev) => ({
          ...prev,
          isFavorite: data.isFavorite,
        }))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save recipe",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving recipe:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const shareRecipe = async () => {
    if (!generatedRecipe?.id) return

    try {
      const response = await fetch("/api/recipes/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: generatedRecipe.id,
          recipeImage: generatedRecipe.image,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShareContent({
          ...data.shareContent,
          recipeImage: generatedRecipe.image,
        })
        setShareModalOpen(true)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to share recipe",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sharing recipe:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Recipe Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ingredients or cooking ideas into delicious recipes with the power of AI
            {locationData && " featuring local cuisine"}
          </p>

          {/* Location & Time Context Display */}
          {locationData && (
            <div className="mt-6">
              <Card className="max-w-md mx-auto border-green-200 bg-green-50">
                <CardContent className="text-center py-4">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Local Cuisine Enabled</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {locationData.city}, {locationData.state}, {locationData.country}
                  </p>
                  {currentMealType && (
                    <p className="text-xs text-green-600 mt-1">Perfect time for {currentMealType} recipes</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                Generate Your Recipe
                {locationData && currentMealType && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentMealType}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Choose how you'd like to create your recipe
                {locationData && ` - defaulting to ${locationData.country} cuisine`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">From Ingredients</TabsTrigger>
                  <TabsTrigger value="text">From Description</TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Available Ingredients</label>
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder={
                            locationData
                              ? `e.g., local ${locationData.country} ingredients...`
                              : "e.g., chicken breast, tomatoes, garlic"
                          }
                          value={ingredient}
                          onChange={(e) => updateIngredient(index, e.target.value)}
                          className="flex-1"
                        />
                        {ingredients.length > 1 && (
                          <Button variant="outline" size="icon" onClick={() => removeIngredient(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addIngredient} className="w-full mt-2 bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Describe Your Recipe Idea</label>
                    <Textarea
                      placeholder={
                        locationData && currentMealType
                          ? `e.g., I want a healthy ${locationData.country} ${currentMealType} dish that's quick to make...`
                          : "e.g., I want a healthy pasta dish with vegetables that's quick to make for dinner..."
                      }
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      rows={4}
                    />
                    {locationData && (
                      <p className="text-xs text-green-600 mt-2">
                        💡 Tip: Leave cuisine unspecified for local {locationData.country} recipes, or mention specific
                        cuisines like "Italian" or "Mexican"
                      </p>
                    )}
                  </div>

                  <RecommendationPrompts
                    isVisible={activeTab === "text"}
                    onPromptSelect={(prompt) => setFreeText(prompt)}
                    locationData={locationData}
                    currentMealType={currentMealType}
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
                    {locationData ? `Generate ${locationData.country} Recipe` : "Generate Recipe"}
                  </>
                )}
              </Button>

              {!locationData && (
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 mb-2">Want local cuisine recommendations?</p>
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

          {/* Generated Recipe Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generated Recipe</CardTitle>
              <CardDescription>
                Your AI-generated recipe will appear here
                {locationData && ` with ${locationData.country} cuisine focus`}
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{generatedRecipe.title}</h3>
                    <p className="text-gray-600 mb-4">{generatedRecipe.description}</p>

                    {/* Location & Time Context */}
                    {(generatedRecipe.localAdaptation || generatedRecipe.timeAppropriate) && (
                      <div className="bg-green-50 p-3 rounded-lg mb-4">
                        {generatedRecipe.localAdaptation && (
                          <p className="text-sm text-green-700 mb-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {generatedRecipe.localAdaptation}
                          </p>
                        )}
                        {generatedRecipe.timeAppropriate && (
                          <p className="text-sm text-green-700">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {generatedRecipe.timeAppropriate}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Recipe Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                        <div className="text-sm font-medium">Prep Time</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.prepTime}</div>
                      </div>
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <div className="text-sm font-medium">Cook Time</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.cookTime}</div>
                      </div>
                      <div className="text-center">
                        <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                        <div className="text-sm font-medium">Servings</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.servings}</div>
                      </div>
                      <div className="text-center">
                        <ChefHat className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                        <div className="text-sm font-medium">Difficulty</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.difficulty}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {generatedRecipe.cuisine && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          <Globe className="h-3 w-3 mr-1" />
                          {generatedRecipe.cuisine}
                        </Badge>
                      )}
                      {generatedRecipe.mealType && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {generatedRecipe.mealType}
                        </Badge>
                      )}
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
                      {generatedRecipe.instructions?.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{instruction}</span>
                        </li>
                      ))}
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
                          isFavorite ? "text-pink-500 fill-pink-500" : "text-white"
                        }`}
                      />
                      Save Recipe
                    </Button>
                    <Button onClick={shareRecipe} variant="outline" className="flex-1 bg-transparent">
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
                    Enter your ingredients or recipe idea and click "Generate Recipe" to get started!
                    {locationData && ` We'll suggest ${locationData.country} cuisine by default.`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
