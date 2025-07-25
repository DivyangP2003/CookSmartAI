export function generateRecipeHTML(recipeData, user) {
  const { recipe } = recipeData

  // Get current date for generation timestamp
  const generatedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Helper function to generate star rating display
  const generateStarRating = (rating, ratingCount) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    let stars = ""

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars += "⭐"
    }

    // Half star
    if (hasHalfStar) {
      stars += "⭐"
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += "☆"
    }

    return `
      <div class="rating-display">
        <span class="stars">${stars}</span>
        <span class="rating-text">${rating.toFixed(1)} (${ratingCount} ${ratingCount === 1 ? "review" : "reviews"})</span>
      </div>
    `
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${recipe.title} - CookSmartAI Recipe</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            transition: all 0.2s;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .print-button:hover {
            background: linear-gradient(135deg, #d97706, #b45309);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .brand-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 1rem;
        }
        
        .brand-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .brand-name {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(to right, #f26b1d, #34a853);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
        }
        
        .recipe-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1f2937;
            margin-bottom: 1rem;
        }
        
        .recipe-description {
            font-size: 1.1rem;
            color: #6b7280;
            max-width: 100%;
            margin: 0 auto;
        }
        
        .recipe-image {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            margin-bottom: 2rem;
        }
        
        .recipe-meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .meta-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            text-align: center;
            transition: transform 0.2s;
        }
        
        .meta-card:hover {
            transform: translateY(-2px);
        }
        
        .meta-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .meta-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.25rem;
        }
        
        .meta-label {
            font-size: 0.875rem;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .rating-display {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .stars {
            font-size: 1.25rem;
        }
        
        .rating-text {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            overflow: hidden;
        }
        
        .card-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .card-content {
            padding: 2rem;
        }
        
        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 2rem;
        }
        
        .tag {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .ingredients-list {
            list-style: none;
            space-y: 0.75rem;
        }
        
        .ingredient-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.75rem;
            background: #f9fafb;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            transition: background-color 0.2s;
        }
        
        .ingredient-item:hover {
            background: #f3f4f6;
        }
        
        .ingredient-bullet {
            color: #f59e0b;
            font-weight: bold;
            font-size: 1.25rem;
            line-height: 1;
            margin-top: 0.125rem;
        }
        
        .instructions-list {
            list-style: none;
        }
        
        .instruction-item {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f9fafb;
            border-radius: 12px;
            transition: all 0.2s;
        }
        
        .instruction-item:hover {
            background: #f3f4f6;
            transform: translateX(4px);
        }
        
        .instruction-number {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.875rem;
        }
        
        .instruction-text {
            flex: 1;
            padding-top: 0.25rem;
        }
        
        .nutrition-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .nutrition-card {
            text-align: center;
            padding: 1.5rem;
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-radius: 12px;
            border: 2px solid transparent;
            transition: all 0.3s;
        }
        
        .nutrition-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .nutrition-card.calories { border-color: #f59e0b; }
        .nutrition-card.protein { border-color: #3b82f6; }
        .nutrition-card.carbs { border-color: #10b981; }
        .nutrition-card.fat { border-color: #eab308; }
        .nutrition-card.fiber { border-color: #8b5cf6; }
        
        .nutrition-value {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
        }
        
        .nutrition-value.calories { color: #f59e0b; }
        .nutrition-value.protein { color: #3b82f6; }
        .nutrition-value.carbs { color: #10b981; }
        .nutrition-value.fat { color: #eab308; }
        .nutrition-value.fiber { color: #8b5cf6; }
        
        .nutrition-label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 600;
        }
        
        .author-section {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            border-left: 4px solid #3b82f6;
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .author-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .author-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #3b82f6;
        }
        
        .author-name {
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 0.25rem;
        }
        
        .author-title {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        @media print {
            body {
                background: white;
            }
            .print-button {
                display: none;
            }
            .card {
                box-shadow: none;
                border: 1px solid #e5e7eb;
                break-inside: avoid;
            }
            .meta-card:hover,
            .instruction-item:hover,
            .ingredient-item:hover {
                transform: none;
                background: inherit;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            .brand-name {
                font-size: 2rem;
            }
            .recipe-title {
                font-size: 2rem;
            }
            .recipe-meta {
                grid-template-columns: repeat(2, 1fr);
            }
            .nutrition-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .print-button {
                position: static;
                margin-bottom: 1rem;
                width: 100%;
                justify-content: center;
            }
        }
    </style>
    <script>
        function printPage() {
            window.print();
        }
    </script>
</head>
<body>
    <button class="print-button" onclick="printPage()">
        🖨️ Print Recipe
    </button>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="brand-container">
                <div class="brand-name">CookSmartAI</div>
            </div>
            <h1 class="recipe-title">${recipe.title}</h1>
            <p class="recipe-description">${recipe.description || "A delicious AI-generated recipe"}</p>
        </div>

        <!-- Recipe Image -->
        ${
          recipe.image && recipe.image !== "/placeholder.svg"
            ? `
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" />
        `
            : ""
        }

        <!-- Recipe Meta Information -->
        <div class="recipe-meta">
            <div class="meta-card">
                <div class="meta-icon">⏱️</div>
                <div class="meta-value">${recipe.prepTime || "N/A"}</div>
                <div class="meta-label">Prep Time</div>
            </div>
            <div class="meta-card">
                <div class="meta-icon">🍳</div>
                <div class="meta-value">${recipe.cookTime || "N/A"}</div>
                <div class="meta-label">Cook Time</div>
            </div>
            <div class="meta-card">
                <div class="meta-icon">👥</div>
                <div class="meta-value">${recipe.servings || "N/A"}</div>
                <div class="meta-label">Servings</div>
            </div>
            <div class="meta-card">
                <div class="meta-icon">📊</div>
                <div class="meta-value">${recipe.difficulty || "Medium"}</div>
                <div class="meta-label">Difficulty</div>
            </div>
            ${
              recipe.weightedRating || recipe.rating
                ? `
            <div class="meta-card">
                <div class="meta-icon">⭐</div>
                ${generateStarRating(recipe.weightedRating || recipe.rating || 0, recipe.ratingCount || 0)}
            </div>
            `
                : ""
            }
        </div>

        <!-- Tags -->
        ${
          recipe.tags && recipe.tags.length > 0
            ? `
        <div class="tags-container">
            ${recipe.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        `
            : ""
        }

        <!-- Ingredients -->
        <div class="card">
            <div class="card-header">
                <div class="card-title">🥬 Ingredients</div>
            </div>
            <div class="card-content">
                <div class="ingredients-list">
                    ${
                      recipe.ingredients && recipe.ingredients.length > 0
                        ? recipe.ingredients
                            .map(
                              (ingredient) => `
                            <div class="ingredient-item">
                                <span class="ingredient-bullet">•</span>
                                <span>${ingredient}</span>
                            </div>
                        `,
                            )
                            .join("")
                        : '<p style="color: #6b7280;">No ingredients listed</p>'
                    }
                </div>
            </div>
        </div>

        <!-- Instructions -->
        <div class="card">
            <div class="card-header">
                <div class="card-title">👨‍🍳 Instructions</div>
            </div>
            <div class="card-content">
                <div class="instructions-list">
                    ${
                      recipe.instructions && recipe.instructions.length > 0
                        ? recipe.instructions
                            .map(
                              (instruction, index) => `
                            <div class="instruction-item">
                                <div class="instruction-number">${index + 1}</div>
                                <div class="instruction-text">${instruction}</div>
                            </div>
                        `,
                            )
                            .join("")
                        : '<p style="color: #6b7280;">No instructions listed</p>'
                    }
                </div>
            </div>
        </div>

        <!-- Nutrition Information -->
        ${
          recipe.nutrition
            ? `
        <div class="card">
            <div class="card-header">
                <div class="card-title">📊 Nutrition (per serving)</div>
            </div>
            <div class="card-content">
                <div class="nutrition-grid">
                    <div class="nutrition-card calories">
                        <div class="nutrition-value calories">${recipe.nutrition.calories || "N/A"}</div>
                        <div class="nutrition-label">Calories</div>
                    </div>
                    <div class="nutrition-card protein">
                        <div class="nutrition-value protein">${recipe.nutrition.protein || "N/A"}g</div>
                        <div class="nutrition-label">Protein</div>
                    </div>
                    <div class="nutrition-card carbs">
                        <div class="nutrition-value carbs">${recipe.nutrition.carbs || "N/A"}g</div>
                        <div class="nutrition-label">Carbs</div>
                    </div>
                    <div class="nutrition-card fat">
                        <div class="nutrition-value fat">${recipe.nutrition.fat || "N/A"}g</div>
                        <div class="nutrition-label">Fat</div>
                    </div>
                    <div class="nutrition-card fiber">
                        <div class="nutrition-value fiber">${recipe.nutrition.fiber || "N/A"}g</div>
                        <div class="nutrition-label">Fiber</div>
                    </div>
                </div>
            </div>
        </div>
        `
            : ""
        }

        <!-- Author Information -->
        ${
          recipe.user
            ? `
        <div class="author-section">
            <div class="author-info">
                <img 
                    src="${recipe.user.imageUrl || "/placeholder.svg?height=48&width=48&text=User"}" 
                    alt="Recipe Author" 
                    class="author-avatar"
                />
                <div>
                    <div class="author-name">${recipe.user.firstName || ""} ${recipe.user.lastName || ""}</div>
                    <div class="author-title">Recipe Creator</div>
                </div>
            </div>
        </div>
        `
            : ""
        }

        <!-- Footer -->
        <div class="footer">
            <p>Generated by CookSmartAI - Your AI Recipe Assistant</p>
            <p>Recipe downloaded on ${generatedDate}</p>
        </div>
    </div>
</body>
</html>`
}
