"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Upload,
  Scan,
  Sparkles,
  Clock,
  Users,
  AlertCircle,
  ChefHat,
  Utensils,
  Download,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ImageScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState("recipe");
  const [error, setError] = useState(null);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllInstructions, setShowAllInstructions] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "error",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file",
          variant: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setScanResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanImage = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch("/api/scanner/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          mode: scanMode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScanResult(data.result);
        setShowAllIngredients(false);
        setShowAllInstructions(false);
        toast({
          title: "Analysis complete!",
          description: `Successfully analyzed image with ${data.result.confidence}% confidence`,
        variant:"success"
        });
      } else {
        throw new Error(data.error || "Failed to analyze image");
      }
    } catch (error) {
      console.error("Scan error:", error);
      setError(error.message);
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "error",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Image Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scan food images to get recipes or nutrition information instantly
            using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-pink-500" />
                Scan Your Image
              </CardTitle>
              <CardDescription>
                Upload an image of food or a recipe to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scan Mode Selection */}
              <Tabs
                value={scanMode}
                onValueChange={setScanMode}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recipe">Get Recipe</TabsTrigger>
                  <TabsTrigger value="nutrition">Get Nutrition</TabsTrigger>
                </TabsList>

                <TabsContent value="recipe" className="mt-4">
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Recipe Mode:</strong> Upload an image of a dish and
                    get the complete recipe with ingredients and instructions.
                  </div>
                </TabsContent>

                <TabsContent value="nutrition" className="mt-4">
                  <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    <strong>Nutrition Mode:</strong> Upload an image of food to
                    get detailed nutritional information and calorie count.
                  </div>
                </TabsContent>
              </Tabs>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                {selectedImage ? (
                  <div className="space-y-4">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected"
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                      <Button
                        onClick={() => setSelectedImage(null)}
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-16 w-16 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Upload an image to scan
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports JPG, PNG, and WEBP files up to 5MB
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-medium">
                      Analysis Failed
                    </h4>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Scan Button */}
              <Button
                onClick={scanImage}
                disabled={!selectedImage || isScanning}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Scan Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Scan Results</CardTitle>
              <CardDescription>
                AI analysis results will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanResult ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {scanResult.type === "recipe" ? (
                      <>
                        {/* Recipe Results */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="h-4 w-4" />
                            {scanResult.confidence}% Match Confidence
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {scanResult.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {scanResult.description}
                          </p>

                          {/* Recipe Info */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center">
                              <Clock className="h-5 w-5 mx-auto mb-1 text-pink-500" />
                              <div className="text-sm font-medium">
                                Prep Time
                              </div>
                              <div className="text-sm text-gray-600">
                                {scanResult.prepTime}
                              </div>
                            </div>
                            <div className="text-center">
                              <Clock className="h-5 w-5 mx-auto mb-1 text-red-500" />
                              <div className="text-sm font-medium">
                                Cook Time
                              </div>
                              <div className="text-sm text-gray-600">
                                {scanResult.cookTime}
                              </div>
                            </div>
                            <div className="text-center">
                              <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                              <div className="text-sm font-medium">
                                Servings
                              </div>
                              <div className="text-sm text-gray-600">
                                {scanResult.servings}
                              </div>
                            </div>
                            <div className="text-center">
                              <ChefHat className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                              <div className="text-sm font-medium">
                                Difficulty
                              </div>
                              <Badge variant="secondary">
                                {scanResult.difficulty}
                              </Badge>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 justify-center mb-6">
                            {scanResult.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          
                        </div>

                        <Separator />

                        {/* Ingredients */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                              <Utensils className="h-5 w-5 text-pink-500" />
                              Ingredients ({scanResult.ingredients?.length || 0}
                              )
                            </h4>
                            {scanResult.ingredients?.length > 5 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setShowAllIngredients(!showAllIngredients)
                                }
                              >
                                {showAllIngredients ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-1" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-1" />
                                    Show All
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {scanResult.ingredients
                              ?.slice(0, showAllIngredients ? undefined : 5)
                              .map((ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg"
                                >
                                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-sm text-gray-700">
                                    {ingredient}
                                  </span>
                                </div>
                              ))}
                            {!showAllIngredients &&
                              scanResult.ingredients?.length > 5 && (
                                <div className="text-sm text-gray-500 italic text-center py-2">
                                  +{scanResult.ingredients.length - 5} more
                                  ingredients...
                                </div>
                              )}
                          </div>
                        </div>

                        <Separator />

                        {/* Instructions */}
                        {scanResult.instructions &&
                          scanResult.instructions.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold flex items-center gap-2">
                                  <ChefHat className="h-5 w-5 text-red-500" />
                                  Instructions ({
                                    scanResult.instructions.length
                                  }{" "}
                                  steps)
                                </h4>
                                {scanResult.instructions.length > 3 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setShowAllInstructions(
                                        !showAllInstructions
                                      )
                                    }
                                  >
                                    {showAllInstructions ? (
                                      <>
                                        <EyeOff className="h-4 w-4 mr-1" />
                                        Show Less
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4 mr-1" />
                                        Show All
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                              <div className="space-y-3">
                                {scanResult.instructions
                                  .slice(0, showAllInstructions ? undefined : 3)
                                  .map((instruction, index) => (
                                    <div
                                      key={index}
                                      className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                      <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        {index + 1}
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        {instruction}
                                      </span>
                                    </div>
                                  ))}
                                {!showAllInstructions &&
                                  scanResult.instructions.length > 3 && (
                                    <div className="text-sm text-gray-500 italic text-center py-2">
                                      +{scanResult.instructions.length - 3} more
                                      steps...
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                        {/* Nutrition Info */}
                        {scanResult.nutrition && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-lg font-semibold mb-3">
                                Nutrition (per serving)
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-orange-50 rounded-lg">
                                  <div className="text-2xl font-bold text-orange-500">
                                    {scanResult.nutrition.calories || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Calories
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-500">
                                    {scanResult.nutrition.protein || "N/A"}g
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Protein
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-500">
                                    {scanResult.nutrition.carbs || "N/A"}g
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Carbs
                                  </div>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                  <div className="text-2xl font-bold text-yellow-500">
                                    {scanResult.nutrition.fat || "N/A"}g
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Fat
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Tips */}
                        {scanResult.tips && scanResult.tips.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-lg font-semibold mb-3">
                                Cooking Tips
                              </h4>
                              <div className="space-y-2">
                                {scanResult.tips.map((tip, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                                  >
                                    <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">
                                      {tip}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Nutrition Results */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="h-4 w-4" />
                            {scanResult.confidence}% Match Confidence
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {scanResult.foodItem}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Per {scanResult.servingSize}
                          </p>

                          {/* Calories */}
                          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-4 mb-6">
                            <div className="text-3xl font-bold">
                              {scanResult.calories}
                            </div>
                            <div className="text-sm opacity-90">Calories</div>
                          </div>
                        </div>

                        <Separator />

                        {/* Macros */}
                        <div>
                          <h4 className="text-lg font-semibold mb-3">
                            Macronutrients
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(scanResult.macros || {}).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium capitalize">
                                      {key}
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {value.amount}g
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full"
                                      style={{ width: `${value.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Health Score */}
                        {scanResult.healthScore && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-lg font-semibold mb-3">
                                Health Score
                              </h4>
                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-500">
                                  {scanResult.healthScore}/10
                                </div>
                                <div className="text-sm text-gray-600">
                                  Overall Healthiness
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Dietary Info */}
                        {scanResult.dietaryInfo &&
                          scanResult.dietaryInfo.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="text-lg font-semibold mb-3">
                                  Dietary Information
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {scanResult.dietaryInfo.map((info, index) => (
                                    <Badge key={index} variant="outline">
                                      {info}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                        {/* Nutrition Highlights */}
                        {scanResult.nutritionHighlights &&
                          scanResult.nutritionHighlights.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="text-lg font-semibold mb-3">
                                  Nutrition Highlights
                                </h4>
                                <div className="space-y-2">
                                  {scanResult.nutritionHighlights.map(
                                    (highlight, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 p-2 bg-green-50 rounded-lg"
                                      >
                                        <Sparkles className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">
                                          {highlight}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                        {/* Considerations */}
                        {scanResult.considerations &&
                          scanResult.considerations.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="text-lg font-semibold mb-3">
                                  Considerations
                                </h4>
                                <div className="space-y-2">
                                  {scanResult.considerations.map(
                                    (consideration, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg"
                                      >
                                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">
                                          {consideration}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                      </>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Upload an image and click "Scan Image" to get AI-powered
                    results!
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
