export function generateMealPlanHTML(mealPlanData) {
  const { mealPlan, user, preferences, aiInsights } = mealPlanData;

  // Define correct meal order
  const mealOrder = ["breakfast", "lunch", "snack", "dinner"];

  // Helper function to sort meals in correct order
  const sortMealsByOrder = (meals) => {
    const sortedMeals = {};
    mealOrder.forEach((mealType) => {
      if (meals[mealType]) {
        sortedMeals[mealType] = meals[mealType];
      }
    });
    return sortedMeals;
  };

  // Get current date for generation timestamp
  const generatedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // // Helper function to get ingredient icons (using Unicode emojis for compatibility)
  // const getIngredientIcon = (ingredient) => {
  //   const item = ingredient.toLowerCase();
  //   if (
  //     item.includes("apple") ||
  //     item.includes("fruit") ||
  //     item.includes("berry")
  //   )
  //     return "🍎";
  //   if (
  //     item.includes("carrot") ||
  //     item.includes("vegetable") ||
  //     item.includes("tomato")
  //   )
  //     return "🥕";
  //   if (
  //     item.includes("fish") ||
  //     item.includes("salmon") ||
  //     item.includes("tuna")
  //   )
  //     return "🐟";
  //   if (
  //     item.includes("chicken") ||
  //     item.includes("beef") ||
  //     item.includes("meat")
  //   )
  //     return "🥩";
  //   if (
  //     item.includes("bread") ||
  //     item.includes("flour") ||
  //     item.includes("pasta")
  //   )
  //     return "🌾";
  //   if (
  //     item.includes("milk") ||
  //     item.includes("cheese") ||
  //     item.includes("yogurt")
  //   )
  //     return "🥛";
  //   return "🥬";
  // };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mealPlan.title || "Meal Plan"} - ${user.firstName} ${
    user.lastName
  }</title>
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
        
.brand-name {
    font-size: 3rem;
    font-weight: 800;
background: linear-gradient(to right, #f26b1d, #34a853);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    margin-bottom: 1.5rem;
}


        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            color: #6b7280;
            font-size: 1.1rem;
        }
        
        .meta-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .meta-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border-left: 4px solid #10b981;
        }
        
        .meta-card h3 {
            font-size: 0.875rem;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
        
        .meta-card p {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1f2937;
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
        
        .card-description {
            color: #6b7280;
            margin-top: 0.25rem;
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
        
        .benefits-list {
            list-style: none;
            margin: 1rem 0;
        }
        
        .benefits-list li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: #1e40af;
        }
        
        .benefits-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }
        
        .badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        
        .badge {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .badge-outline {
            background: white;
            color: #374151;
            border: 1px solid #d1d5db;
        }
        
        .allergies-section {
            margin-top: 1.5rem;
            padding: 1rem;
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
        }
        
        .allergies-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .allergies-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .allergy-badge {
            background: #f59e0b;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .days-grid {
            display: grid;
            gap: 1.5rem;
        }
        
        .day-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .day-header {
            background: linear-gradient(135deg, #f9fafb, #f3f4f6);
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .day-title {
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .day-date {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: normal;
        }
        
        .meals-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            padding: 1.5rem;
        }
        
        .meal-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            transition: all 0.2s;
        }
        
        .meal-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .meal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .meal-type {
            font-weight: 600;
            text-transform: capitalize;
            color: #1f2937;
        }
        
        .meal-time {
            font-size: 0.875rem;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .meal-name {
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.25rem;
        }
        
        .meal-calories {
            font-size: 0.875rem;
            color: #6b7280;
        }
        
        .shopping-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.75rem;
        }
        
        .shopping-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: #f9fafb;
            border-radius: 8px;
            transition: background-color 0.2s;
        }
        
        .shopping-item:hover {
            background: #f3f4f6;
        }
        
        .shopping-icon {
            font-size: 1.25rem;
        }
        
        .shopping-text {
            font-weight: 500;
            color: #374151;
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
            .meal-card:hover {
                transform: none;
                box-shadow: none;
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            .header h1 {
                font-size: 2rem;
            }
            .meals-grid {
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
        🖨️ Print Meal Plan
    </button>
    
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="brand-container">
                <div class="brand-name">CookSmartAI</div>
            </div>
            <h1>Your Personalized Meal Plan</h1>
            <p>Generated on ${generatedDate} for ${user.firstName} ${
    user.lastName
  }</p>
        </div>

        <!-- Meta Information -->
        <div class="meta-info">
            <div class="meta-card">
                <h3>Duration</h3>
                <p>${preferences.days} ${
    preferences.days === "1" ? "Day" : "Days"
  }</p>
            </div>
            <div class="meta-card">
                <h3>Servings</h3>
                <p>${preferences.servings} ${
    preferences.servings === 1 ? "Person" : "People"
  }</p>
            </div>
            <div class="meta-card">
                <h3>Total Calories</h3>
                <p>${mealPlan.totalCalories?.toLocaleString() || "N/A"}</p>
            </div>
            ${
              preferences.budget
                ? `
            <div class="meta-card">
                <h3>Budget</h3>
                <p>$${preferences.budget}</p>
            </div>
            `
                : ""
            }
        </div>

        <!-- Preferences -->
        ${
          preferences.dietaryPreferences?.length > 0 ||
          preferences.allergies?.length > 0
            ? `
        <div class="card">
            <div class="card-header">
                <div class="card-title">🎯 Your Preferences</div>
            </div>
            <div class="card-content">
                ${
                  preferences.dietaryPreferences?.length > 0
                    ? `
                <div class="badges">
                    ${preferences.dietaryPreferences
                      .map((pref) => `<span class="badge">${pref}</span>`)
                      .join("")}
                </div>
                `
                    : ""
                }
                ${
                  preferences.allergies?.length > 0
                    ? `
                <div class="allergies-section">
                    <div class="allergies-title">
                        ⚠️ Allergies & Restrictions
                    </div>
                    <div class="allergies-list">
                        ${preferences.allergies
                          .map(
                            (allergy) =>
                              `<span class="allergy-badge">${allergy}</span>`
                          )
                          .join("")}
                    </div>
                </div>
                `
                    : ""
                }
            </div>
        </div>
        `
            : ""
        }

        <!-- AI Insights -->
        ${
          aiInsights
            ? `
        <div class="card ai-insights">
            <div class="card-header">
                <div class="card-title">💡 AI Insights</div>
                <div class="card-description">Why this plan works for you</div>
            </div>
            <div class="card-content">
                ${
                  aiInsights.benefits?.length > 0
                    ? `
                <ul class="benefits-list">
                    ${aiInsights.benefits
                      .map((benefit) => `<li>${benefit}</li>`)
                      .join("")}
                </ul>
                `
                    : ""
                }
                ${
                  aiInsights.nutritionalHighlights
                    ? `
                <div style="margin-top: 1rem;">
                    <strong>Nutritional Highlights:</strong>
                    <p style="margin-top: 0.5rem;">${aiInsights.nutritionalHighlights}</p>
                </div>
                `
                    : ""
                }
            </div>
        </div>
        `
            : ""
        }

        <!-- Daily Meal Plans -->
        ${
          mealPlan.days?.length > 0
            ? `
        <div class="card">
            <div class="card-header">
                <div class="card-title">🍽️ Your Meal Schedule</div>
                <div class="card-description">Daily meal breakdown with timing and calories</div>
            </div>
            <div class="card-content">
                <div class="days-grid">
                    ${mealPlan.days
                      .map(
                        (day) => `
                    <div class="day-card">
                        <div class="day-header">
                            <div class="day-title">
                                <span>${day.day}</span>
                                <span class="day-date">${day.date}</span>
                            </div>
                        </div>
                        <div class="meals-grid">
                            ${Object.entries(sortMealsByOrder(day.meals || {}))
                              .map(
                                ([mealType, meal]) => `
                            <div class="meal-card">
                                <div class="meal-header">
                                    <div class="meal-type">${mealType}</div>
                                    <div class="meal-time">🕐 ${meal.time}</div>
                                </div>
                                <div class="meal-name">${meal.name}</div>
                                <div class="meal-calories">${meal.calories} calories</div>
                            </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
        `
            : ""
        }

        <!-- Shopping List -->
        ${
          mealPlan.shoppingList?.length > 0
            ? `
        <div class="card">
            <div class="card-header">
                <div class="card-title">🛒 Shopping List</div>
                <div class="card-description">Everything you need for your meal plan</div>
            </div>
            <div class="card-content">
                <div class="shopping-grid">
                    ${mealPlan.shoppingList
                      .map(
                        (item) => `
                    <div class="shopping-item">
                        <span class="shopping-text">${item}</span>
                    </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
        `
            : ""
        }

        <!-- Footer -->
        <div class="footer">
            <p>Generated by CookSmartAI - Your AI Meal Planning Assistant</p>
            <p>Plan created for ${user.email} on ${generatedDate}</p>
        </div>
    </div>
</body>
</html>`;
}
