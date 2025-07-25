"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecipeImage({
  src,
  alt,
  className = "",
  onRegenerate,
  allowRegeneration = false,
  isRegenerating = false,
  fallbackText = "Recipe Image",
}) {
  const [imageSrc, setImageSrc] = useState(src)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (src) {
      console.log("RecipeImage: Loading image:", src)
      setImageSrc(src)
      setImageLoading(true)
      setImageError(false)
      setRetryCount(0)
    } else {
      console.log("RecipeImage: No src provided, using fallback")
      setImageError(true)
      setImageSrc(`/placeholder.svg?height=600&width=800&text=${encodeURIComponent(fallbackText)}`)
      setImageLoading(false)
    }
  }, [src, fallbackText])

  const handleImageLoad = () => {
    console.log("RecipeImage: Image loaded successfully:", imageSrc)
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    console.log("RecipeImage: Image failed to load:", imageSrc, "Retry count:", retryCount)
    setImageLoading(false)

    if (retryCount < 3 && imageSrc && !imageSrc.includes("placeholder.svg")) {
      // Try to reload the image after a short delay
      setTimeout(
        () => {
          console.log("RecipeImage: Retrying image load, attempt:", retryCount + 1)
          setRetryCount((prev) => prev + 1)
          setImageLoading(true)
          // Force reload by adding timestamp
          const separator = src.includes("?") ? "&" : "?"
          setImageSrc(`${src}${separator}retry=${retryCount + 1}&t=${Date.now()}`)
        },
        1000 * (retryCount + 1),
      ) // Increasing delay for each retry
    } else {
      // Use fallback after retries
      console.log("RecipeImage: Using fallback after", retryCount, "retries")
      setImageError(true)
      setImageSrc(`/placeholder.svg?height=600&width=800&text=${encodeURIComponent(fallbackText)}`)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading State */}
      {imageLoading && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
          <div className="text-gray-400 text-sm">Loading image...</div>
        </div>
      )}

      {/* Image */}
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
      />

      {/* Regeneration Button */}
      {allowRegeneration && onRegenerate && (
        <div className="absolute top-4 right-4 z-20">
          <Button
            size="icon"
            variant="secondary"
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
            onClick={onRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>
      )}

      {/* Error State Indicator */}
      {imageError && retryCount >= 3 && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded z-20">
          Image failed to load
        </div>
      )}

      {/* Retry Indicator */}
      {retryCount > 0 && retryCount < 3 && imageLoading && (
        <div className="absolute bottom-2 left-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded z-20">
          Retrying... ({retryCount}/3)
        </div>
      )}
    </div>
  )
}
