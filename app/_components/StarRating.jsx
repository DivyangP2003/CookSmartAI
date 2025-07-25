"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";

export default function StarRating({
  recipeId,
  initialRating = 0,
  readonly = false,
  size = "md",
  onRatingChange,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewStartTime] = useState(Date.now());
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  useEffect(() => {
    if (recipeId && !readonly) {
      fetchUserRating();
    }
  }, [recipeId, readonly]);

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/recipes/rate?recipeId=${recipeId}`);
      const data = await response.json();

      if (data.success) {
        setUserRating(data.userRating);
        setHasRated(data.hasRated);
        if (data.userRating) {
          setRating(data.userRating);
        }
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  const handleRatingSubmit = async (newRating) => {
    if (readonly || isSubmitting) return;

    setIsSubmitting(true);
    const viewTime = Math.floor((Date.now() - viewStartTime) / 1000);

    try {
      const response = await fetch("/api/recipes/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId,
          rating: newRating,
          viewTime, // Still track view time but don't enforce minimum
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRating(newRating);
        setUserRating(newRating);
        setHasRated(true);

        toast({
          title: "Success!",
          description: data.message,
          variant:"success"
        });

        if (onRatingChange) {
          onRatingChange(newRating);
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit rating",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating) => {
    if (readonly) return;
    handleRatingSubmit(starRating);
  };

  const handleStarHover = (starRating) => {
    if (readonly) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className={`p-0 h-auto ${
            readonly ? "cursor-default" : "cursor-pointer hover:bg-transparent"
          }`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly || isSubmitting}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            } ${!readonly && "hover:fill-yellow-300 hover:text-yellow-300"}`}
          />
        </Button>
      ))}

      {!readonly && (
        <div className="ml-2 text-sm text-gray-600">
          {hasRated ? (
            <span>
              You rated: {userRating} star{userRating !== 1 ? "s" : ""}
            </span>
          ) : (
            <span>Click to rate</span>
          )}
        </div>
      )}

      {isSubmitting && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
        </div>
      )}
    </div>
  );
}
