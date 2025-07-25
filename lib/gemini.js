import { GoogleGenerativeAI } from "@google/generative-ai"
import { jsonrepair } from "jsonrepair"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
})

function safeParseJSON(rawText) {
  const match = rawText.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("No JSON object found in response")

  try {
    return JSON.parse(jsonrepair(match[0]))
  } catch (err) {
    console.error("JSON parsing/repair failed:", err)
    throw new Error("Failed to parse repaired JSON")
  }
}

function cleanText(text) {
  if (typeof text !== "string") return text

  // Remove bold formatting (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, "$1")

  // Remove numbered prefixes from instructions (e.g., "1. ", "21. ")
  text = text.replace(/^\d+\.\s*/, "")

  // Remove any remaining markdown formatting
  text = text.replace(/\*([^*]+)\*/g, "$1") // Remove *italic*
  text = text.replace(/`([^`]+)`/g, "$1") // Remove `code`

  return text.trim()
}

function cleanRecipeData(recipe) {
  if (!recipe) return recipe

  // Clean ingredients
  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients = recipe.ingredients.map((ingredient) => cleanText(ingredient))
  }

  // Clean instructions
  if (Array.isArray(recipe.instructions)) {
    recipe.instructions = recipe.instructions.map((instruction) => cleanText(instruction))
  }

  // Clean other text fields
  if (recipe.title) recipe.title = cleanText(recipe.title)
  if (recipe.description) recipe.description = cleanText(recipe.description)
  if (Array.isArray(recipe.tips)) {
    recipe.tips = recipe.tips.map((tip) => cleanText(tip))
  }

  return recipe
}

export async function generateRecipe(prompt) {
  try {
    const result = await geminiModel.generateContent(`
You are a professional chef and recipe developer. Create a detailed, authentic recipe based on this request: "${prompt}"

Analyze the request and consider:
- What type of dish is being requested
- What cuisine or cooking style would be most appropriate
- What ingredients would create the best flavor profile
- What cooking techniques would work best
- What difficulty level is appropriate
- What dietary considerations might apply

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "Descriptive recipe name",
  "description": "Brief but appetizing description of the dish",
  "prepTime": "X mins",
  "cookTime": "X mins",
  "servings": number,
  "difficulty": "Easy/Medium/Hard",
  "ingredients": [
    "specific ingredient with precise amount and preparation",
    "another ingredient with amount and preparation notes"
  ],
  "instructions": [
    "Clear step-by-step instruction without numbers",
    "Another detailed cooking step",
    "Final preparation step"
  ],
  "tags": ["Relevant", "Dietary", "Tags"],
  "cuisine": "Specific cuisine type",
  "nutrition": {
    "calories": realistic_number_per_serving,
    "protein": grams_per_serving,
    "carbs": grams_per_serving,
    "fat": grams_per_serving
  }
}

CRITICAL REQUIREMENTS:
- Do NOT use bold formatting (**text**) anywhere in the response
- Do NOT use italic formatting (*text*) anywhere in the response
- Do NOT use markdown formatting of any kind
- Do NOT number the instructions (no "1.", "2.", etc.)
- Use only plain text in all fields

INGREDIENT SPECIFICATIONS:
- Include precise measurements (e.g., "2 cups all-purpose flour", "1 large onion, diced", "3 cloves garlic, minced")
- Specify preparation methods (diced, chopped, sliced, etc.)
- Include temperature specifications where relevant (room temperature, cold, etc.)
- Be specific about ingredient types (all-purpose flour vs bread flour, etc.)

INSTRUCTION REQUIREMENTS:
- Each instruction should be a complete, clear step
- Include cooking temperatures, times, and visual cues
- Mention when to add seasonings and how much
- Include texture and doneness indicators
- Start each instruction with an action verb

TAGS MUST BE from this list only: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Low-Carb", "Mediterranean", "Spicy", "Quick", "Healthy", "Comfort Food"]

NUTRITION VALUES:
- Calculate realistic values based on ingredients and serving size
- Consider cooking methods that affect calories (frying adds calories, etc.)
- Provide per-serving values

Example of correct formatting:
Ingredient: "2 cups basmati rice, rinsed and drained"
Instruction: "Heat oil in a large heavy-bottomed pot over medium-high heat until shimmering"
NOT: "1. Heat oil in a large heavy-bottomed pot over medium-high heat until shimmering"
NOT: "**Heat oil** in a large heavy-bottomed pot over medium-high heat until shimmering"`)

    const response = await result.response
    const text = response.text()
    const recipe = safeParseJSON(text)

    if (!Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions) || !Array.isArray(recipe.tags)) {
      throw new Error("Recipe must include valid arrays for ingredients, instructions, and tags.")
    }

    return cleanRecipeData(recipe)
  } catch (error) {
    console.error("Gemini API Error (generateRecipe):", error)
    throw error
  }
}

export async function generateMealPlan(preferences) {
  try {
    const { days, servings, dietaryPreferences, budget, allergies } = preferences

    const dietaryText = dietaryPreferences?.length ? dietaryPreferences.join(", ") : "No specific dietary preferences"
    const allergiesText = allergies?.length ? allergies.join(", ") : "No allergies"
    const budgetText = budget ? `$${budget}` : "flexible budget"

    const result = await geminiModel.generateContent(`
You are a professional nutritionist and meal planning expert. Create a comprehensive ${days}-day meal plan with these specifications:

USER REQUIREMENTS:
- Number of people: ${servings}
- Dietary preferences: ${dietaryText}
- Allergies/Restrictions: ${allergiesText}
- Budget: ${budgetText}
- Duration: ${days} days

MEAL PLANNING PRINCIPLES:
- Create nutritionally balanced meals across all days
- Ensure variety in proteins, vegetables, and cooking methods
- Consider meal prep efficiency and ingredient overlap
- Balance quick meals with more elaborate cooking
- Include seasonal and accessible ingredients
- Respect dietary restrictions completely
- Provide realistic portion sizes and calorie estimates

Respond ONLY with a valid JSON object in this exact format:
{
  "days": [
    {
      "day": "Day name (Monday, Tuesday, etc.)",
      "date": "Month Day format",
      "meals": {
        "breakfast": {
          "name": "Specific meal name",
          "time": "Realistic time (e.g., 7:30 AM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the meal"
        },
        "lunch": {
          "name": "Specific meal name",
          "time": "Realistic time (e.g., 12:30 PM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the meal"
        },
        "snack": {
          "name": "Healthy snack option",
          "time": "Realistic time (e.g., 4:00 PM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the snack"
        },
        "dinner": {
          "name": "Specific meal name",
          "time": "Realistic time (e.g., 7:00 PM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the meal"
        }
      },
      "dailyCalories": total_calories_for_the_day,
      "nutritionFocus": "Main nutritional benefit of the day"
    }
  ],
  "totalCalories": total_calories_for_all_days,
  "averageDailyCalories": average_per_day,
  "shoppingList": [
    "Specific ingredient with estimated quantity",
    "Another ingredient with quantity",
  ],
  "mealPrepTips": [
    "Practical meal prep suggestion",
    "Time-saving cooking tip",
    "Storage recommendation"
  ],
  "nutritionSummary": {
    "proteinSources": ["List of main protein sources used"],
    "vegetableVariety": ["Types of vegetables included"],
    "healthHighlights": ["Key nutritional benefits"]
  }
}

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere
- Do NOT use italic formatting (*text*) anywhere
- Do NOT use markdown formatting of any kind
- Use only plain text in all fields
- Meal names should be specific and appetizing
- Include realistic prep times and calorie estimates
- Shopping list should be organized and practical

MEAL VARIETY REQUIREMENTS:
- No repeated meals within the plan period
- Balance of different protein sources
- Variety of cooking methods (grilled, baked, sautéed, raw, etc.)
- Mix of cuisines while respecting dietary preferences
- Include both familiar and slightly adventurous options

CALORIE GUIDELINES:
- Breakfast: 300-500 calories
- Lunch: 400-600 calories  
- Dinner: 500-700 calories
- Snacks: 100-200 calories
- Adjust based on servings and activity level

SHOPPING LIST REQUIREMENTS:
- For each ingredient, include a relevant emoji icon at the BEGINNING of the line, followed by the name and quantity (e.g., "🥑 Avocado: 2 medium")
- Do NOT place the emoji at the end
- Format each item like this: "[emoji] Ingredient: quantity"
- Provide a flat list of only essential ingredients required to prepare the meals
- Do NOT include any category labels like "Produce:", "Dairy:", etc.
- Exclude minor pantry items like salt, pepper, oil, and common spices unless absolutely essential to a recipe
- Only include key ingredients in realistic quantities for ${servings} people
- Avoid listing duplicates; consolidate where applicable
`)

    const response = await result.response
    const text = response.text()
    const mealPlan = safeParseJSON(text)

    // Add real dates if missing
    if (mealPlan.days) {
      const today = new Date()
      mealPlan.days.forEach((day, index) => {
        const date = new Date(today)
        date.setDate(today.getDate() + index)
        day.date = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      })
    }

    return mealPlan
  } catch (error) {
    console.error("Gemini API Error (generateMealPlan):", error)
    throw error
  }
}

export async function generateMealPlanInsights(mealPlan, preferences) {
  try {
    const { dietaryPreferences, allergies, budget, servings } = preferences

    const result = await geminiModel.generateContent(`
You are a certified nutritionist analyzing this meal plan for health and wellness insights.

MEAL PLAN DATA:
${JSON.stringify(mealPlan)}

USER PROFILE:
- Dietary preferences: ${dietaryPreferences?.join(", ") || "None"}
- Allergies/Restrictions: ${allergies?.join(", ") || "None"}
- Budget considerations: ${budget ? `$${budget}` : "Flexible"}
- Serving size: ${servings} people

Analyze this meal plan comprehensively and provide insights on its nutritional value, health benefits, and practical advantages.

Respond ONLY with a valid JSON object in this exact format:
{
  "benefits": [
    "Specific health benefit with explanation",
    "Another nutritional advantage",
    "Practical benefit for the user"
  ],
  "nutritionalHighlights": "Comprehensive summary of the nutritional strengths of this meal plan",
  "healthScore": number (1-10, overall healthiness rating),
  "balanceAnalysis": {
    "proteinAdequacy": "Assessment of protein variety and quantity",
    "vegetableIntake": "Analysis of vegetable variety and nutrients",
    "fiberContent": "Evaluation of fiber sources and amounts",
    "healthyFats": "Assessment of healthy fat sources"
  },
  "improvements": [
    "Specific suggestion for enhancement",
    "Another improvement recommendation"
  ],
  "sustainabilityScore": number (1-10, how sustainable this plan is long-term)
}

ANALYSIS REQUIREMENTS:
- Evaluate nutritional completeness and balance
- Consider variety and sustainability
- Assess alignment with user's dietary preferences
- Evaluate practical aspects (prep time, cost, accessibility)
- Identify any nutritional gaps or excesses
- Consider meal timing and energy distribution

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere
- Do NOT use italic formatting (*text*) anywhere  
- Do NOT use markdown formatting of any kind
- Use only plain text in all fields
- Provide specific, actionable insights
- Base recommendations on nutritional science`)

    const response = await result.response
    const text = response.text()
    return safeParseJSON(text)
  } catch (error) {
    console.error("Gemini AI Insights Error:", error)
    return {
      benefits: [
        "This meal plan is customized for your preferences",
        "Provides nutritional balance and variety",
        "Designed for your specified number of servings",
      ],
      nutritionalHighlights: "Balanced nutrition with appropriate portion sizes.",
    }
  }
}

export async function calculateNutrition(ingredients, servings = 1) {
  try {
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided.")
    }

    const ingredientList = ingredients.map((ing, i) => `${i + 1}. ${ing}`).join("\n")
    const result = await geminiModel.generateContent(`
You are a certified nutritionist and food scientist. Calculate precise nutritional information for these ingredients:

INGREDIENTS TO ANALYZE:
${ingredientList}

SERVING INFORMATION:
- Total servings: ${servings}
- Calculate per-serving values

ANALYSIS REQUIREMENTS:
- Use USDA nutritional database standards
- Consider ingredient preparation methods
- Account for cooking losses where applicable
- Provide realistic, accurate estimates
- Consider bioavailability of nutrients

Respond ONLY with a valid JSON object in this exact format:
{
  "totalCalories": precise_number_per_serving,
  "macros": {
    "protein": {
      "amount": grams_per_serving,
      "percentage": percentage_of_total_calories,
      "quality": "Assessment of protein completeness"
    },
    "carbs": {
      "amount": grams_per_serving,
      "percentage": percentage_of_total_calories,
      "fiber": grams_of_fiber,
      "sugar": grams_of_sugar
    },
    "fat": {
      "amount": grams_per_serving,
      "percentage": percentage_of_total_calories,
      "saturated": grams_saturated_fat,
      "unsaturated": grams_unsaturated_fat
    }
  },
  "vitamins": {
    "vitaminA": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminC": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "vitaminD": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminE": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "vitaminK": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "folate": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminB12": {"amount": number, "unit": "mcg", "dailyValue": percentage}
  },
  "minerals": {
    "calcium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "iron": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "magnesium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "potassium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "zinc": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "sodium": {"amount": number, "unit": "mg", "dailyValue": percentage}
  },
  "fiber": {"amount": number, "unit": "g", "dailyValue": percentage},
  "nutritionScore": number (1-10, overall nutritional value),
  "healthHighlights": [
    "Key nutritional strength",
    "Another important nutrient benefit",
    "Health advantage of this combination"
  ]
}

CALCULATION STANDARDS:
- Use 2000-calorie daily value references
- Round to appropriate decimal places
- Consider nutrient interactions and absorption
- Account for processing and cooking effects
- Provide conservative but accurate estimates

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere
- Do NOT use italic formatting (*text*) anywhere
- Do NOT use markdown formatting of any kind
- Use only plain text in all fields
- Provide precise numerical values
- Base calculations on established nutritional databases`)

    const response = await result.response
    const text = response.text()
    return safeParseJSON(text)
  } catch (error) {
    console.error("Gemini API Error (calculateNutrition):", error)
    throw error
  }
}

export async function calculateDetailedNutrition(ingredients, recipeText = "", servings = 1) {
  try {
    const hasIngredients = ingredients && ingredients.length > 0
    const inputText = hasIngredients
      ? `INGREDIENT LIST WITH AMOUNTS:\n\n${ingredients
          .map((ing, i) => `${i + 1}. ${ing}`)
          .join("\n")}\n\nAnalyze the complete nutritional profile of ALL these ingredients combined.`
      : recipeText
        ? `COMPLETE RECIPE OR DISH:\n\n${recipeText}\n\nAnalyze the nutritional content of this complete dish.`
        : null

    const servingNote = `\n\nSERVING INFORMATION:\n- Total servings: ${servings}\n- Provide per-serving nutritional values`

    if (!inputText) {
      throw new Error("Either ingredients or recipe text must be provided")
    }

    const result = await geminiModel.generateContent(`
You are a registered dietitian and nutrition scientist. Provide a comprehensive nutritional analysis of this food.

${inputText}${servingNote}

ANALYSIS SCOPE:
- Complete macro and micronutrient breakdown
- Bioavailability considerations
- Health impact assessment
- Dietary pattern alignment
- Nutritional density evaluation

Respond ONLY with a valid JSON object in this exact format:
{
  "totalCalories": precise_calories_per_serving,
  "macros": {
    "protein": {
      "amount": grams_per_serving,
      "unit": "g",
      "percentage": percentage_of_calories,
      "dailyValue": percentage_of_daily_needs,
      "quality": "Complete/Incomplete protein assessment",
      "sources": ["Primary protein sources in this dish"]
    },
    "carbs": {
      "amount": grams_per_serving,
      "unit": "g", 
      "percentage": percentage_of_calories,
      "dailyValue": percentage_of_daily_needs,
      "fiber": grams_of_fiber,
      "sugar": grams_of_sugar,
      "starch": grams_of_starch,
      "glycemicImpact": "Low/Medium/High glycemic impact"
    },
    "fat": {
      "amount": grams_per_serving,
      "unit": "g",
      "percentage": percentage_of_calories,
      "dailyValue": percentage_of_daily_needs,
      "saturated": grams_saturated,
      "monounsaturated": grams_mono,
      "polyunsaturated": grams_poly,
      "omega3": grams_omega3,
      "cholesterol": milligrams_cholesterol
    },
    "sodium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "fiber": {"amount": number, "unit": "g", "dailyValue": percentage}
  },
  "vitamins": {
    "vitaminA": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminC": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "vitaminD": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminE": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "vitaminK": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "thiamin": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "riboflavin": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "niacin": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "vitaminB6": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "folate": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminB12": {"amount": number, "unit": "mcg", "dailyValue": percentage}
  },
  "minerals": {
    "calcium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "iron": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "magnesium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "phosphorus": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "potassium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "zinc": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "selenium": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "copper": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "manganese": {"amount": number, "unit": "mg", "dailyValue": percentage}
  },
  "insights": {
    "strengths": [
      "Specific nutritional strength with explanation",
      "Another key nutritional benefit",
      "Additional health advantage"
    ],
    "considerations": [
      "Nutritional consideration or limitation",
      "Another factor to be aware of"
    ],
    "healthTips": [
      "Practical tip to maximize nutritional benefits",
      "Suggestion for balanced consumption",
      "Pairing recommendation for better nutrition"
    ],
    "summary": "Comprehensive summary of the overall nutritional profile and health impact"
  },
  "servingSize": "Realistic serving size description",
  "servings": number,
  "nutritionDensity": number (1-10, nutrient density score),
  "healthScore": number (1-10, overall healthiness rating),
  "dietaryFit": {
    "vegetarian": boolean,
    "vegan": boolean,
    "glutenFree": boolean,
    "dairyFree": boolean,
    "lowCarb": boolean,
    "keto": boolean
  }
}

CALCULATION STANDARDS:
- Use current USDA and WHO nutritional standards
- Consider cooking methods and nutrient retention
- Account for bioavailability and absorption factors
- Provide evidence-based assessments
- Use 2000-calorie daily value references

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere
- Do NOT use italic formatting (*text*) anywhere
- Do NOT use markdown formatting of any kind
- Use only plain text in all fields
- Provide specific, actionable insights
- Base all values on established nutritional science`)

    const response = await result.response
    const text = response.text()
    return safeParseJSON(text)
  } catch (error) {
    console.error("Gemini API Error (calculateDetailedNutrition):", error)
    throw error
  }
}

export async function analyzeImageForRecipe(imageBase64) {
  try {
    const result = await geminiModel.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
      `Analyze this food image and provide a complete recipe to recreate this dish.

Look at the image carefully and identify:
- The main dish/food item
- Visible ingredients and components
- Cooking method (fried, baked, grilled, etc.)
- Presentation style and garnishes
- Estimated difficulty level

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "Name of the dish",
  "description": "Brief description of the dish",
  "confidence": number (1-100, how confident you are in the identification),
  "prepTime": "X mins",
  "cookTime": "X mins", 
  "servings": number,
  "difficulty": "Easy/Medium/Hard",
  "ingredients": [
    "specific ingredient with amount",
    "another ingredient with amount"
  ],
  "instructions": [
    "Step description without numbers",
    "Another step description",
    "Final step description"
  ],
  "tags": ["Vegetarian", "Spicy", "Indian"],
  "cuisine": "Cuisine type",
  "nutrition": {
    "calories": estimated_number,
    "protein": estimated_grams,
    "carbs": estimated_grams,
    "fat": estimated_grams
  },
  "tips": [
    "Cooking tip 1",
    "Cooking tip 2"
  ]
}

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere in the response
- Do NOT use italic formatting (*text*) anywhere in the response
- Do NOT use markdown formatting of any kind
- Do NOT number the instructions (no "1.", "2.", etc.)
- Instructions should be plain text descriptions of each step
- Ingredients should be plain text with amounts (no bold formatting)
- Use only plain text in all fields
- Be specific with ingredient amounts (e.g., "2 cups rice", "1 tbsp oil")
- Instructions should be clear step-by-step directions without numbers
- Tags should be relevant dietary/cuisine tags
- Confidence should reflect how clearly you can identify the dish
- If you can't identify the dish clearly, set confidence below 70

Example of correct instruction format:
"Heat oil in a large pan over medium heat"
NOT: "1. Heat oil in a large pan over medium heat"
NOT: "**Heat oil** in a large pan over medium heat"`,
    ])

    const response = await result.response
    const text = response.text()
    const recipe = safeParseJSON(text)

    // Validate required fields
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error("Invalid recipe analysis response")
    }

    return cleanRecipeData(recipe)
  } catch (error) {
    console.error("Gemini Image Recipe Analysis Error:", error)
    throw error
  }
}

export async function analyzeImageForNutrition(imageBase64) {
  try {
    const result = await geminiModel.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
      `Analyze this food image and provide detailed nutritional information.

Look at the image carefully and identify:
- The food items and their approximate portions
- Cooking methods that affect nutrition
- Visible ingredients and their nutritional contributions
- Estimated serving size

Respond ONLY with a valid JSON object in this exact format:
{
  "foodItem": "Name of the main food/dish",
  "confidence": number (1-100, confidence in identification),
  "servingSize": "Estimated serving size (e.g., '1 cup', '1 medium bowl')",
  "calories": estimated_total_calories,
  "macros": {
    "protein": {
      "amount": grams,
      "percentage": percentage_of_total_calories
    },
    "carbs": {
      "amount": grams,
      "percentage": percentage_of_total_calories
    },
    "fat": {
      "amount": grams,
      "percentage": percentage_of_total_calories
    },
    "fiber": {
      "amount": grams
    }
  },
  "vitamins": {
    "vitaminA": {"amount": number, "unit": "mcg", "dailyValue": percentage},
    "vitaminC": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "vitaminD": {"amount": number, "unit": "mcg", "dailyValue": percentage}
  },
  "minerals": {
    "calcium": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "iron": {"amount": number, "unit": "mg", "dailyValue": percentage},
    "sodium": {"amount": number, "unit": "mg", "dailyValue": percentage}
  },
  "healthScore": number (1-10, overall healthiness),
  "dietaryInfo": [
    "Vegetarian",
    "High Protein",
    "Low Carb"
  ],
  "nutritionHighlights": [
    "Good source of protein",
    "Contains healthy fats",
    "Rich in vitamins"
  ],
  "considerations": [
    "High in sodium",
    "Contains dairy"
  ]
}

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere in the response
- Do NOT use italic formatting (*text*) anywhere in the response
- Do NOT use markdown formatting of any kind
- Use only plain text in all fields
- Base estimates on visible portion size
- Consider cooking methods (fried foods have more calories)
- Be realistic with nutritional values
- Confidence should reflect how clearly you can identify the food
- If multiple food items, analyze the complete meal`,
    ])

    const response = await result.response
    const text = response.text()
    const nutrition = safeParseJSON(text)

    // Validate required fields
    if (!nutrition.foodItem || !nutrition.calories || !nutrition.macros) {
      throw new Error("Invalid nutrition analysis response")
    }

    return nutrition
  } catch (error) {
    console.error("Gemini Image Nutrition Analysis Error:", error)
    throw error
  }
}
