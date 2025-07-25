"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Search,
  Clock,
  Users,
  Heart,
  Star,
  ChefHat,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";
import RecipeDetailModal from "@/app/_components/RecipeDetailModal";
import RecipeImage from "@/app/_components/ReceiptImage";
import RatingDisplay from "@/app/_components/RatingDisplay";

let searchDebounceTimeout;

export default function ExploreRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [userSearch, setUserSearch] = useState("");
  const [filters, setFilters] = useState({
    cuisines: [],
    dietTypes: [],
    difficulties: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [selectedCuisine, setSelectedCuisine] = useState("All Cuisines");
  const [selectedDiet, setSelectedDiet] = useState("All Diets");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();

  const checkFavorites = async (recipeIds) => {
    try {
      const response = await fetch("/api/recipes/favourite/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeIds }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Favorites checked:", data.favorites); // Debug log
        setFavorites(new Set(data.favorites));
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };
  const fetchRecipes = async (page = 1) => {
    try {
      setLoading(true);
      setCurrentPage(page);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedCuisine !== "All Cuisines")
        params.append("cuisine", selectedCuisine);
      if (selectedDiet !== "All Diets") params.append("diet", selectedDiet);
      if (selectedDifficulty !== "All Difficulties")
        params.append("difficulty", selectedDifficulty);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (userSearch.trim()) params.append("user", userSearch.trim());

      const response = await fetch(`/api/recipes/global?${params}`);
      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
        setPagination(data.pagination);
        setFilters(data.filters);
        // Check which recipes are favorited after fetching recipes
        if (data.recipes.length > 0) {
          checkFavorites(data.recipes.map((recipe) => recipe.id));
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch recipes",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRecipes(1);
  }, []);

  // Refetch on filter change
  useEffect(() => {
    if (
      selectedCuisine !== "All Cuisines" ||
      selectedDiet !== "All Diets" ||
      selectedDifficulty !== "All Difficulties"
    ) {
      fetchRecipes(1);
    }
  }, [selectedCuisine, selectedDiet, selectedDifficulty]);
  // Debounced search
  useEffect(() => {
    if (searchDebounceTimeout) clearTimeout(searchDebounceTimeout);

    searchDebounceTimeout = setTimeout(() => {
      if (searchQuery.trim() || userSearch.trim()) {
        fetchRecipes(1);
      }
    }, 500);

    return () => clearTimeout(searchDebounceTimeout);
  }, [searchQuery, userSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(1);
  };

  const handlePageChange = (page) => {
    fetchRecipes(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRecipeView = async (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };
  // Handle favorite toggle
  const handleFavoriteToggle = async (e, recipeId) => {
    e.stopPropagation(); // Prevent opening the modal

    try {
      const response = await fetch("/api/recipes/favourite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update favorites state immediately
        const newFavorites = new Set(favorites);
        if (data.isFavorite) {
          newFavorites.add(recipeId);
        } else {
          newFavorites.delete(recipeId);
        }
        setFavorites(newFavorites);

        toast({
          title: "Success!",
          description: data.message,
          variant:"success"
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update favorite",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    }
  };

  const handleImageRegenerate = async (e, recipeId) => {
    e.stopPropagation();
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
        // Update the recipe image in the recipes list
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.id === recipeId ? { ...recipe, image: data.image } : recipe
          )
        );

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
      setImageLoading((prev) => ({ ...prev, [recipeId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore World Recipes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover authentic recipes from different cuisines and countries
            worldwide
          </p>
        </div>

        {/* FILTERS */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-500" />
              Find Your Perfect Recipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Search recipes, cuisines, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Search by user..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Select
                    value={selectedCuisine}
                    onValueChange={setSelectedCuisine}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Cuisines">All Cuisines</SelectItem>
                      {filters.cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedDiet} onValueChange={setSelectedDiet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Diet Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Diets">All Diets</SelectItem>
                      {filters.dietTypes.map((diet) => (
                        <SelectItem key={diet} value={diet}>
                          {diet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Difficulties">
                        All Difficulties
                      </SelectItem>
                      {filters.difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedCuisine("All Cuisines");
                    setSelectedDiet("All Diets");
                    setSelectedDifficulty("All Difficulties");
                    setSearchQuery("");
                    setUserSearch("");
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Found {pagination.total} recipes
              {selectedCuisine !== "All Cuisines" &&
                ` in ${selectedCuisine} cuisine`}
              {selectedDiet !== "All Diets" && ` for ${selectedDiet} diet`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-gray-600">Loading delicious recipes...</p>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleRecipeView(recipe)}
              >
                <div className="relative">
                  <RecipeImage
                    src={recipe.image}
                    alt={recipe.title}
                    // className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    className="w-full h-48"
                    onRegenerate={(e) => handleImageRegenerate(e, recipe.id)}
                    allowRegeneration={false} // Disable regeneration on explore page for other users' recipes
                    isRegenerating={imageLoading[recipe.id]}
                    fallbackText={recipe.title}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
                      onClick={(e) => handleFavoriteToggle(e, recipe.id)}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          favorites.has(recipe.id)
                            ? "text-pink-500 fill-pink-500"
                            : "text-gray-400 hover:text-pink-500"
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/70 text-white">
                      {recipe.cuisine}
                    </Badge>
                  </div>
                  {(recipe.weightedRating > 0 || recipe.ratingCount > 0) && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <RatingDisplay
                          weightedRating={
                            recipe.weightedRating || recipe.rating
                          }
                          ratingCount={recipe.ratingCount}
                          size="sm"
                          showCount={false}
                          showText={true}
                        />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">
                        {recipe.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {recipe.title}
                    </CardTitle>
                  </div>
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
                      <span>{recipe.viewCount}</span>
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
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <img
                        src={
                          recipe.user?.imageUrl ||
                          "/placeholder.svg?height=20&width=20&text=U" ||
                          "/placeholder.svg"
                        }
                        alt="Author"
                        className="w-4 h-4 rounded-full"
                      />
                      <span>
                        {recipe.user?.firstName} {recipe.user?.lastName}
                      </span>
                    </div>
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
                    onClick={() => handleRecipeView(recipe)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm"
                  >
                    View Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Recipes Found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms to find more recipes.
              </p>
              <Button
                onClick={() => {
                  setSelectedCuisine("All Cuisines");
                  setSelectedDiet("All Diets");
                  setSelectedDifficulty("All Difficulties");
                  setSearchQuery("");
                  setCurrentPage(1);
                  fetchRecipes(1);
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {!loading && recipes.length > 0 && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-transparent"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-transparent"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="bg-transparent"
            >
              Next
            </Button>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && recipes.length > 0 && (
          <div className="text-center mt-8 text-sm text-gray-500">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total} recipes
          </div>
        )}

        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showAuthor={true}
          allowImageRegeneration={false}
        />
      </div>
    </div>
  );
}
