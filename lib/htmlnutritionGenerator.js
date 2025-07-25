export function generateNutritionHTML(nutritionData, inputData, user) {
  // Get current date for generation timestamp
  const generatedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Helper function to format ingredient list
  const formatIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return ""
    return ingredients.map(ingredient => `<li class="ingredient-item">${ingredient}</li>`).join("")
  }

  // Helper function to render nutrient section
  const renderNutrientSection = (nutrients, title, colorClass = "bg-blue-500") => {
    if (!nutrients || Object.keys(nutrients).length === 0) {
      return `<div class="text-center py-4 text-gray-500">No ${title.toLowerCase()} data available</div>`
    }

    return Object.entries(nutrients).map(([key, value]) => `
      <div class="nutrient-card">
        <div class="nutrient-header">
          <span class="nutrient-name">${key.replace(/([A-Z])/g, " $1").trim()}</span>
          <span class="nutrient-value">
            ${value.amount}${value.unit}
            ${value.dailyValue ? `<span class="daily-value">(${value.dailyValue}% DV)</span>` : ""}
          </span>
        </div>
        ${value.dailyValue ? `
          <div class="progress-bar">
            <div class="progress-fill ${colorClass}" style="width: ${Math.min(value.dailyValue, 100)}%"></div>
          </div>
        ` : ""}
      </div>
    `).join("")
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nutrition Analysis - CookSmartAI</title>
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
            max-width: 1200px;
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
        
        .header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            color: #6b7280;
            font-size: 1.1rem;
        }
        
        .calories-overview {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            text-align: center;
            padding: 2rem;
            border-radius: 16px;
            margin-bottom: 2rem;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        .calories-number {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }
        
        .calories-label {
            font-size: 1.25rem;
            opacity: 0.9;
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
        
        .ai-insights {
            border-left: 4px solid #3b82f6;
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
        }
        
        .ai-insights .card-header {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        }
        
        .ai-insights .card-title {
            color: #1e40af;
        }
        
        .insights-section {
            margin-bottom: 1.5rem;
        }
        
        .insights-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .insights-list {
            list-style: none;
            margin: 0.5rem 0;
        }
        
        .insights-list li {
            padding: 0.25rem 0;
            padding-left: 1rem;
            position: relative;
            font-size: 0.875rem;
        }
        
        .insights-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            font-weight: bold;
        }
        
        .strengths-list li:before { color: #10b981; }
        .considerations-list li:before { color: #f59e0b; }
        .tips-list li:before { color: #3b82f6; }
        
        .strengths-list li { color: #065f46; }
        .considerations-list li { color: #92400e; }
        .tips-list li { color: #1e40af; }
        
        .macro-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .macro-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .macro-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .macro-card.protein { border-color: #3b82f6; }
        .macro-card.carbs { border-color: #10b981; }
        .macro-card.fat { border-color: #f59e0b; }
        
        .macro-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .macro-icon.protein { background: #dbeafe; }
        .macro-icon.carbs { background: #d1fae5; }
        .macro-icon.fat { background: #fef3c7; }
        
        .macro-amount {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        
        .macro-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.5rem;
        }
        
        .macro-percentage {
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .macro-percentage.protein { color: #3b82f6; }
        .macro-percentage.carbs { color: #10b981; }
        .macro-percentage.fat { color: #f59e0b; }
        
        .nutrients-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .nutrient-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 0.75rem;
            transition: all 0.2s;
        }
        
        .nutrient-card:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(-1px);
        }
        
        .nutrient-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .nutrient-name {
            font-weight: 500;
            text-transform: capitalize;
            color: #374151;
        }
        
        .nutrient-value {
            font-weight: 600;
            color: #1f2937;
        }
        
        .daily-value {
            font-size: 0.75rem;
            color: #6b7280;
            margin-left: 0.25rem;
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
        }
        
        .progress-fill.bg-blue-500 { background: #3b82f6; }
        .progress-fill.bg-green-500 { background: #10b981; }
        .progress-fill.bg-purple-500 { background: #8b5cf6; }
        .progress-fill.bg-orange-500 { background: #f59e0b; }
        
        .ingredients-section {
            background: #f9fafb;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .ingredients-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .ingredients-list {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.5rem;
        }
        
        .ingredient-item {
            background: white;
            padding: 0.75rem;
            border-radius: 6px;
            border-left: 3px solid #10b981;
            font-weight: 500;
        }
        
        .recipe-section {
            background: #f0f9ff;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            border-left: 4px solid #3b82f6;
        }
        
        .recipe-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .recipe-text {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
            color: #374151;
        }
        
        .disclaimer {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 2rem;
        }
        
        .disclaimer-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 0.5rem;
        }
        
        .disclaimer-text {
            font-size: 0.875rem;
            color: #92400e;
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
            .nutrient-card:hover {
                transform: none;
                box-shadow: none;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            .brand-name {
                font-size: 2rem;
            }
            .calories-number {
                font-size: 3rem;
            }
            .macro-grid {
                grid-template-columns: 1fr;
            }
            .nutrients-grid {
                grid-template-columns: 1fr;
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
        🖨️ Print Analysis
    </button>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="brand-container">
                <div class="brand-icon">👨‍🍳</div>
                <div class="brand-name">CookSmartAI</div>
            </div>
            <h1>Nutrition Analysis Report</h1>
            <p>Generated on ${generatedDate} for ${user.firstName} ${user.lastName}</p>
        </div>

        <!-- Calories Overview -->
        <div class="calories-overview">
            <div class="calories-number">${nutritionData.totalCalories}</div>
            <div class="calories-label">
                Total Calories ${nutritionData.servings > 1 ? `(${nutritionData.servings} servings)` : ""}
            </div>
        </div>

        <!-- Input Data -->
        ${inputData.ingredients && inputData.ingredients.length > 0 ? `
        <div class="ingredients-section">
            <div class="ingredients-title">
                🥬 Analyzed Ingredients
            </div>
            <ul class="ingredients-list">
                ${formatIngredients(inputData.ingredients)}
            </ul>
        </div>
        ` : ""}

        ${inputData.recipeText ? `
        <div class="recipe-section">
            <div class="recipe-title">
                📝 Recipe Analysis
            </div>
            <div class="recipe-text">${inputData.recipeText}</div>
        </div>
        ` : ""}

        <!-- AI Insights -->
        ${nutritionData.insights ? `
        <div class="card ai-insights">
            <div class="card-header">
                <div class="card-title">💡 AI Nutritional Insights</div>
            </div>
            <div class="card-content">
                ${nutritionData.insights.summary ? `
                <div class="insights-section">
                    <p style="font-style: italic; color: #1e40af; margin-bottom: 1rem;">${nutritionData.insights.summary}</p>
                </div>
                ` : ""}

                ${nutritionData.insights.strengths && nutritionData.insights.strengths.length > 0 ? `
                <div class="insights-section">
                    <div class="insights-title" style="color: #065f46;">✅ Nutritional Strengths:</div>
                    <ul class="insights-list strengths-list">
                        ${nutritionData.insights.strengths.map(strength => `<li>${strength}</li>`).join("")}
                    </ul>
                </div>
                ` : ""}

                ${nutritionData.insights.considerations && nutritionData.insights.considerations.length > 0 ? `
                <div class="insights-section">
                    <div class="insights-title" style="color: #92400e;">⚠️ Considerations:</div>
                    <ul class="insights-list considerations-list">
                        ${nutritionData.insights.considerations.map(consideration => `<li>${consideration}</li>`).join("")}
                    </ul>
                </div>
                ` : ""}

                ${nutritionData.insights.healthTips && nutritionData.insights.healthTips.length > 0 ? `
                <div class="insights-section">
                    <div class="insights-title" style="color: #1e40af;">💡 Health Tips:</div>
                    <ul class="insights-list tips-list">
                        ${nutritionData.insights.healthTips.map(tip => `<li>${tip}</li>`).join("")}
                    </ul>
                </div>
                ` : ""}
            </div>
        </div>
        ` : ""}

        <!-- Macronutrients -->
        ${nutritionData.macros ? `
        <div class="card">
            <div class="card-header">
                <div class="card-title">📊 Macronutrients Breakdown</div>
            </div>
            <div class="card-content">
                <div class="macro-grid">
                    ${nutritionData.macros.protein ? `
                    <div class="macro-card protein">
                        <div class="macro-icon protein">🥩</div>
                        <div class="macro-amount">${nutritionData.macros.protein.amount}g</div>
                        <div class="macro-label">Protein</div>
                        <div class="macro-percentage protein">${nutritionData.macros.protein.percentage}%</div>
                        ${nutritionData.macros.protein.dailyValue ? `<div class="daily-value">${nutritionData.macros.protein.dailyValue}% Daily Value</div>` : ""}
                    </div>
                    ` : ""}
                    
                    ${nutritionData.macros.carbs ? `
                    <div class="macro-card carbs">
                        <div class="macro-icon carbs">🌾</div>
                        <div class="macro-amount">${nutritionData.macros.carbs.amount}g</div>
                        <div class="macro-label">Carbohydrates</div>
                        <div class="macro-percentage carbs">${nutritionData.macros.carbs.percentage}%</div>
                        ${nutritionData.macros.carbs.dailyValue ? `<div class="daily-value">${nutritionData.macros.carbs.dailyValue}% Daily Value</div>` : ""}
                    </div>
                    ` : ""}
                    
                    ${nutritionData.macros.fat ? `
                    <div class="macro-card fat">
                        <div class="macro-icon fat">🥑</div>
                        <div class="macro-amount">${nutritionData.macros.fat.amount}g</div>
                        <div class="macro-label">Fat</div>
                        <div class="macro-percentage fat">${nutritionData.macros.fat.percentage}%</div>
                        ${nutritionData.macros.fat.dailyValue ? `<div class="daily-value">${nutritionData.macros.fat.dailyValue}% Daily Value</div>` : ""}
                    </div>
                    ` : ""}
                </div>
            </div>
        </div>
        ` : ""}

        <!-- Vitamins & Minerals -->
        <div class="nutrients-grid">
            ${nutritionData.vitamins && Object.keys(nutritionData.vitamins).length > 0 ? `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">🍊 Vitamins</div>
                </div>
                <div class="card-content">
                    ${renderNutrientSection(nutritionData.vitamins, "Vitamins", "bg-green-500")}
                </div>
            </div>
            ` : ""}

            ${nutritionData.minerals && Object.keys(nutritionData.minerals).length > 0 ? `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">⚡ Minerals</div>
                </div>
                <div class="card-content">
                    ${renderNutrientSection(nutritionData.minerals, "Minerals", "bg-purple-500")}
                </div>
            </div>
            ` : ""}
        </div>

        <!-- Other Nutrients -->
        ${nutritionData.macros && Object.keys(nutritionData.macros).some(key => !["protein", "carbs", "fat"].includes(key)) ? `
        <div class="card">
            <div class="card-header">
                <div class="card-title">📈 Other Nutrients</div>
            </div>
            <div class="card-content">
                ${Object.entries(nutritionData.macros)
                  .filter(([key]) => !["protein", "carbs", "fat"].includes(key))
                  .map(([key, value]) => `
                    <div class="nutrient-card">
                        <div class="nutrient-header">
                            <span class="nutrient-name">${key.replace(/([A-Z])/g, " $1").trim()}</span>
                            <span class="nutrient-value">
                                ${value.amount}${value.unit}
                                ${value.dailyValue ? `<span class="daily-value">(${value.dailyValue}% DV)</span>` : ""}
                            </span>
                        </div>
                        ${value.dailyValue ? `
                            <div class="progress-bar">
                                <div class="progress-fill bg-orange-500" style="width: ${Math.min(value.dailyValue, 100)}%"></div>
                            </div>
                        ` : ""}
                    </div>
                  `).join("")}
            </div>
        </div>
        ` : ""}

        <!-- Disclaimer -->
        <div class="disclaimer">
            <div class="disclaimer-title">⚠️ Important Disclaimer</div>
            <div class="disclaimer-text">
                This nutrition analysis is an estimate based on standard food composition databases and AI calculations. 
                Actual values may vary based on specific brands, preparation methods, and portion sizes. 
                This information is not intended to replace professional medical advice. 
                Please consult with a healthcare professional or registered dietitian for personalized nutrition guidance.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Generated by CookSmartAI - Your AI Nutrition Analysis Assistant</p>
            <p>Analysis created for ${user.email} on ${generatedDate}</p>
        </div>
    </div>
</body>
</html>`
}
