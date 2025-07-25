// Utility functions for PDF generation
export const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatCalories = (calories) => {
  if (!calories) return "N/A"
  return `${calories.toLocaleString()} calories`
}

export const getMealIcon = (mealType) => {
  const icons = {
    breakfast: "🍳",
    lunch: "🥗",
    dinner: "🍽️",
    snack: "🍎",
    default: "🍴",
  }
  return icons[mealType.toLowerCase()] || icons.default
}

export const getCategoryIcon = (category) => {
  const icons = {
    Proteins: "🥩",
    "Vegetables & Fruits": "🥕",
    "Grains & Carbs": "🌾",
    "Dairy & Eggs": "🥛",
    "Pantry Items": "🧂",
    Other: "📦",
  }
  return icons[category] || "📦"
}

// Color palette for consistent theming
export const colors = {
  primary: [34, 197, 94], // Green
  secondary: [59, 130, 246], // Blue
  accent: [168, 85, 247], // Purple
  text: [31, 41, 55], // Gray-800
  lightGray: [243, 244, 246], // Gray-100
  mediumGray: [156, 163, 175], // Gray-400
  white: [255, 255, 255],
}
