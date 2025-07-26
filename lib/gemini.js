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

// Helper function to get cultural meal timing context
function getMealTimingContext(location) {
  if (!location) return ""

  const { country, countryCode, state, city, timezone } = location

  // Create comprehensive meal timing context based on location
  let timingContext = `
MEAL TIMING & CULTURAL CONTEXT:
- User timezone: ${timezone}
- Location: ${city}, ${state}, ${country}
- Country code: ${countryCode}

IMPORTANT: Adjust meal times according to local eating habits and cultural norms for ${country}. Consider the following regional patterns:

GENERAL REGIONAL MEAL TIMING PATTERNS:
`

  // Add specific cultural meal timing patterns based on country/region
  switch (countryCode) {
    case "IN": // India
      timingContext += `
INDIAN MEAL TIMING CULTURE:
- Breakfast: 7:00-9:00 AM (varies by region, earlier in South India)
- Lunch: 12:30-2:00 PM (main meal in many regions)
- Evening Tea/Snack: 4:00-6:00 PM (important cultural practice)
- Dinner: 7:30-9:30 PM (varies significantly by state)

STATE-SPECIFIC VARIATIONS IN INDIA:
- North India (Delhi, Punjab, Rajasthan): Dinner typically 8:00-9:30 PM
- West India (Maharashtra, Gujarat): Lunch 1:00-2:00 PM, Dinner 8:30-9:30 PM  
- South India (Tamil Nadu, Karnataka): Earlier meals, Dinner 7:30-8:30 PM
- East India (West Bengal): Rice-based meals, Lunch 1:30-2:30 PM, Dinner 8:00-9:00 PM

CULTURAL CONSIDERATIONS:
- Tea time (4:00-6:00 PM) is essential in Indian culture
- Many families eat dinner together after work (7:30-9:00 PM)
- Breakfast varies from light (South) to heavy (North)
- Regional festivals and fasting may affect timing`
      break

    case "ES": // Spain
      timingContext += `
SPANISH MEAL TIMING CULTURE:
- Breakfast: 8:00-9:00 AM (light, coffee and pastry)
- Lunch: 2:00-3:30 PM (main meal of the day)
- Merienda (Snack): 5:00-6:00 PM (especially for children)
- Dinner: 9:00-11:00 PM (late dinner culture)

CULTURAL CONSIDERATIONS:
- Siesta culture affects meal timing
- Lunch is the most important meal
- Very late dinner compared to other countries`
      break

    case "IT": // Italy
      timingContext += `
ITALIAN MEAL TIMING CULTURE:
- Breakfast: 7:00-8:00 AM (light, cappuccino and cornetto)
- Lunch: 1:00-2:30 PM (important meal)
- Aperitivo: 6:00-8:00 PM (social drinking with snacks)
- Dinner: 8:00-9:30 PM (family meal time)

CULTURAL CONSIDERATIONS:
- No cappuccino after 11 AM cultural rule
- Long lunch breaks are common
- Family dinner time is sacred`
      break

    case "JP": // Japan
      timingContext += `
JAPANESE MEAL TIMING CULTURE:
- Breakfast: 6:30-8:00 AM (traditional or Western style)
- Lunch: 12:00-1:00 PM (quick, often bento boxes)
- Dinner: 6:00-8:00 PM (family meal, multiple courses)

CULTURAL CONSIDERATIONS:
- Punctual meal times
- Seasonal eating habits
- Group dining culture`
      break

    case "MX": // Mexico
      timingContext += `
MEXICAN MEAL TIMING CULTURE:
- Breakfast: 7:00-9:00 AM (hearty meal)
- Comida (Main meal): 2:00-4:00 PM (largest meal of day)
- Merienda: 6:00-7:00 PM (light snack)
- Cena (Dinner): 8:00-10:00 PM (lighter than comida)

CULTURAL CONSIDERATIONS:
- Comida is the main meal, not dinner
- Late dining culture
- Family-style eating`
      break

    case "FR": // France
      timingContext += `
FRENCH MEAL TIMING CULTURE:
- Breakfast: 7:00-8:30 AM (light, coffee and pastry)
- Lunch: 12:00-2:00 PM (proper meal with courses)
- Goûter: 4:00-5:00 PM (afternoon snack, especially children)
- Dinner: 7:30-9:00 PM (family meal time)

CULTURAL CONSIDERATIONS:
- Long lunch breaks (1-2 hours)
- Structured meal times
- No snacking between meals culture`
      break

    case "DE": // Germany
      timingContext += `
GERMAN MEAL TIMING CULTURE:
- Breakfast: 6:30-8:00 AM (hearty meal)
- Lunch: 12:00-1:00 PM (warm meal)
- Kaffee und Kuchen: 3:00-4:00 PM (coffee and cake)
- Dinner: 6:00-7:30 PM (often cold cuts, Abendbrot)

CULTURAL CONSIDERATIONS:
- Early dinner compared to Southern Europe
- Structured meal schedule
- Coffee and cake tradition`
      break

    case "GB": // United Kingdom
      timingContext += `
BRITISH MEAL TIMING CULTURE:
- Breakfast: 7:00-9:00 AM (full English or light)
- Lunch: 12:00-1:00 PM (quick meal)
- Tea Time: 3:00-5:00 PM (afternoon tea tradition)
- Dinner: 6:00-8:00 PM (main evening meal)

CULTURAL CONSIDERATIONS:
- Afternoon tea is cultural tradition
- Earlier dinner times
- Pub culture affects evening eating`
      break

    case "US": // United States
      timingContext += `
AMERICAN MEAL TIMING CULTURE:
- Breakfast: 6:30-8:30 AM (varies by work schedule)
- Lunch: 12:00-1:00 PM (quick, often eaten at work)
- Snack: 3:00-4:00 PM (optional)
- Dinner: 6:00-8:00 PM (main family meal)

CULTURAL CONSIDERATIONS:
- Work schedule heavily influences timing
- Regional variations exist
- Fast-paced eating culture`
      break

    case "CN": // China
      timingContext += `
CHINESE MEAL TIMING CULTURE:
- Breakfast: 6:00-8:00 AM (congee, steamed buns)
- Lunch: 11:30 AM-1:00 PM (important meal)
- Dinner: 5:30-7:30 PM (family meal, multiple dishes)

CULTURAL CONSIDERATIONS:
- Earlier meal times than Western countries
- Shared dishes culture
- Regional variations in timing`
      break

    default:
      timingContext += `
GENERAL MEAL TIMING FOR ${country}:
- Breakfast: 7:00-9:00 AM (adjust based on local work culture)
- Lunch: 12:00-2:00 PM (consider local business hours)
- Snack: 3:00-5:00 PM (if culturally appropriate)
- Dinner: 7:00-9:00 PM (adjust based on local dining culture)

RESEARCH LOCAL CUSTOMS:
- Consider work schedules and cultural norms in ${city}, ${state}
- Adapt to local dining traditions and family meal times
- Account for seasonal variations in meal timing`
  }

  timingContext += `

TIMEZONE CONSIDERATIONS:
- Current timezone: ${timezone}
- Adjust all meal times to feel natural for someone living in ${city}, ${state}
- Consider daylight hours and work schedules in this timezone
- Make meal times feel authentic to local lifestyle

IMPORTANT: Use meal times that locals in ${city}, ${state}, ${country} would actually follow, not generic times. Research and apply authentic cultural meal timing patterns.`

  return timingContext
}

// Helper function to determine meal type based on current time and timezone
function getMealTypeFromTime(timezone) {
  if (!timezone) return ""

  try {
    const now = new Date()
    const timeInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
    const hour = timeInTimezone.getHours()

    // Determine meal type based on hour
    if (hour >= 5 && hour < 10) {
      return "breakfast"
    } else if (hour >= 10 && hour < 12) {
      return "brunch or late breakfast"
    } else if (hour >= 12 && hour < 15) {
      return "lunch"
    } else if (hour >= 15 && hour < 17) {
      return "afternoon snack or tea time"
    } else if (hour >= 17 && hour < 21) {
      return "dinner"
    } else if (hour >= 21 && hour < 24) {
      return "late dinner or evening snack"
    } else {
      return "late night snack"
    }
  } catch (error) {
    console.error("Error determining meal type from time:", error)
    return ""
  }
}

// Helper function to get location-based cuisine context
function getLocationCuisineContext(location) {
  if (!location) return ""

  const { country, countryCode, state, city, timezone } = location

  let cuisineContext = `
LOCATION-BASED CUISINE CONTEXT:
- User location: ${city}, ${state}, ${country}
- Country code: ${countryCode}
- Timezone: ${timezone}

IMPORTANT: Unless the user specifically mentions a different cuisine (like "Italian pasta" or "Mexican tacos"), 
DEFAULT to local ${country} cuisine and cooking styles from ${city}, ${state}.

LOCAL CUISINE PREFERENCES:
`

  // Add specific cuisine guidance based on country
  switch (countryCode) {
    case "IN": // India
      cuisineContext += `
INDIAN CUISINE FOCUS:
- Default to authentic Indian recipes using local spices and cooking methods
- Consider regional variations: North Indian (Punjab, Delhi), South Indian (Tamil Nadu, Karnataka), West Indian (Maharashtra, Gujarat), East Indian (West Bengal)
- Use traditional Indian ingredients: turmeric, cumin, coriander, garam masala, curry leaves, mustard seeds
- Include popular Indian cooking methods: tadka (tempering), dum cooking, tandoor-style
- State-specific preferences:
  - ${state === "Rajasthan" ? "Rajasthani cuisine: dal baati churma, gatte ki sabzi, ker sangri" : ""}
  - ${state === "Maharashtra" ? "Maharashtrian cuisine: vada pav, misal pav, puran poli" : ""}
  - ${state === "Tamil Nadu" ? "Tamil cuisine: sambar, rasam, dosa, idli" : ""}
  - ${state === "Punjab" ? "Punjabi cuisine: butter chicken, sarson da saag, makki di roti" : ""}
  - ${state === "West Bengal" ? "Bengali cuisine: fish curry, rice, mishti doi" : ""}
- Adapt spice levels and ingredients to local ${state} preferences`
      break

    case "IT": // Italy
      cuisineContext += `
ITALIAN CUISINE FOCUS:
- Default to authentic Italian recipes with regional variations
- Use traditional Italian ingredients: olive oil, garlic, tomatoes, basil, parmesan
- Include classic Italian cooking methods: pasta making, risotto techniques, pizza dough
- Regional specialties from different Italian regions`
      break

    case "MX": // Mexico
      cuisineContext += `
MEXICAN CUISINE FOCUS:
- Default to authentic Mexican recipes with traditional ingredients
- Use Mexican staples: corn, beans, chili peppers, lime, cilantro, avocado
- Include traditional cooking methods: nixtamalization, grilling, slow cooking
- Regional Mexican variations and street food influences`
      break

    case "JP": // Japan
      cuisineContext += `
JAPANESE CUISINE FOCUS:
- Default to authentic Japanese recipes with traditional techniques
- Use Japanese ingredients: soy sauce, miso, dashi, rice, nori, wasabi
- Include Japanese cooking methods: steaming, grilling, raw preparation
- Focus on seasonal ingredients and presentation`
      break

    case "TH": // Thailand
      cuisineContext += `
THAI CUISINE FOCUS:
- Default to authentic Thai recipes with traditional flavors
- Use Thai ingredients: fish sauce, coconut milk, lemongrass, galangal, Thai chilies
- Include Thai cooking methods: stir-frying, curry making, som tam preparation
- Balance sweet, sour, salty, and spicy flavors`
      break

    case "CN": // China
      cuisineContext += `
CHINESE CUISINE FOCUS:
- Default to authentic Chinese recipes with regional variations
- Use Chinese ingredients: soy sauce, ginger, garlic, rice wine, sesame oil
- Include Chinese cooking methods: stir-frying, steaming, braising, dim sum
- Regional styles: Cantonese, Sichuan, Hunan, Beijing cuisine`
      break

    case "FR": // France
      cuisineContext += `
FRENCH CUISINE FOCUS:
- Default to authentic French recipes with classical techniques
- Use French ingredients: butter, herbs, wine, cheese, cream
- Include French cooking methods: sautéing, braising, sauce making
- Regional French specialties and bistro-style cooking`
      break

    case "ES": // Spain
      cuisineContext += `
SPANISH CUISINE FOCUS:
- Default to authentic Spanish recipes with regional variations
- Use Spanish ingredients: olive oil, saffron, paprika, sherry, manchego
- Include Spanish cooking methods: paella making, tapas preparation, grilling
- Regional specialties: Andalusian, Basque, Catalan cuisine`
      break

    case "KR": // South Korea
      cuisineContext += `
KOREAN CUISINE FOCUS:
- Default to authentic Korean recipes with traditional fermentation
- Use Korean ingredients: gochujang, kimchi, sesame oil, soy sauce, garlic
- Include Korean cooking methods: grilling, fermenting, stir-frying, soup making
- Focus on banchan (side dishes) and balanced meals`
      break

    case "US": // United States
      cuisineContext += `
AMERICAN CUISINE FOCUS:
- Default to American regional cuisine and comfort food
- Use American ingredients and cooking styles
- Include regional variations: Southern, Tex-Mex, California, New England
- Focus on hearty, accessible ingredients and cooking methods`
      break

    default:
      cuisineContext += `
LOCAL ${country.toUpperCase()} CUISINE FOCUS:
- Default to authentic ${country} recipes and local cooking styles
- Use ingredients commonly available in ${city}, ${state}
- Include traditional cooking methods popular in ${country}
- Adapt to local taste preferences and dietary habits in ${state}`
  }

  return cuisineContext
}

// Enhanced cuisine detection logic
function analyzePromptForCuisine(prompt, userLocation) {
  const promptLower = prompt.toLowerCase()

  // STEP 1: Check for explicit style mentions FIRST (highest priority)
  const stylePatterns = [
    /(\w+)\s+style/i,
    /(\w+)\s+version/i,
    /as\s+per\s+(\w+)/i,
    /(\w+)\s+way/i,
    /in\s+(\w+)\s+style/i,
  ]

  for (const pattern of stylePatterns) {
    const match = promptLower.match(pattern)
    if (match) {
      const requestedStyle = match[1].toLowerCase()
      // Map common style names to regions
      const styleMapping = {
        indian: "India",
        maharashtrian: "Maharashtra",
        rajasthani: "Rajasthan",
        punjabi: "Punjab",
        tamil: "Tamil Nadu",
        bengali: "West Bengal",
        gujarati: "Gujarat",
        south: "South India",
        north: "North India",
        italian: "Italy",
        mexican: "Mexico",
        japanese: "Japan",
        thai: "Thailand",
        french: "France",
        spanish: "Spain",
        chinese: "China",
        korean: "South Korea",
        american: "United States",
        british: "United Kingdom",
        greek: "Greece",
        turkish: "Turkey",
        lebanese: "Lebanon",
        moroccan: "Morocco",
      }

      if (styleMapping[requestedStyle]) {
        return {
          type: "explicit_style",
          region:
            styleMapping[requestedStyle] === "India" ? userLocation?.state || "India" : styleMapping[requestedStyle],
          country:
            styleMapping[requestedStyle] === "India"
              ? "India"
              : [
                    "Maharashtra",
                    "Rajasthan",
                    "Punjab",
                    "Tamil Nadu",
                    "West Bengal",
                    "Gujarat",
                    "South India",
                    "North India",
                  ].includes(styleMapping[requestedStyle])
                ? "India"
                : styleMapping[requestedStyle],
        }
      }
    }
  }

  // STEP 2: Check for explicit international cuisine mentions (before regional dish check)
  const internationalCuisines = [
    "italian",
    "mexican",
    "chinese",
    "japanese",
    "thai",
    "french",
    "spanish",
    "korean",
    "vietnamese",
    "greek",
    "turkish",
    "lebanese",
    "moroccan",
    "american",
    "british",
  ]

  for (const cuisine of internationalCuisines) {
    if (promptLower.includes(cuisine)) {
      return {
        type: "international_cuisine",
        cuisine: cuisine,
        country:
          cuisine === "italian"
            ? "Italy"
            : cuisine === "mexican"
              ? "Mexico"
              : cuisine === "chinese"
                ? "China"
                : cuisine === "japanese"
                  ? "Japan"
                  : cuisine === "thai"
                    ? "Thailand"
                    : cuisine === "french"
                      ? "France"
                      : cuisine === "spanish"
                        ? "Spain"
                        : cuisine === "korean"
                          ? "South Korea"
                          : cuisine === "vietnamese"
                            ? "Vietnam"
                            : cuisine === "greek"
                              ? "Greece"
                              : cuisine === "turkish"
                                ? "Turkey"
                                : cuisine === "lebanese"
                                  ? "Lebanon"
                                  : cuisine === "moroccan"
                                    ? "Morocco"
                                    : cuisine === "american"
                                      ? "United States"
                                      : cuisine === "british"
                                        ? "United Kingdom"
                                        : "International",
      }
    }
  }

  // STEP 3: Check for regional dish recognition (only if no explicit style mentioned)
  const regionalDishes = {
    // Maharashtra dishes
    "puran poli": { region: "Maharashtra", country: "India" },
    "vada pav": { region: "Maharashtra", country: "India" },
    "misal pav": { region: "Maharashtra", country: "India" },
    "bhel puri": { region: "Maharashtra", country: "India" },
    "pav bhaji": { region: "Maharashtra", country: "India" },
    modak: { region: "Maharashtra", country: "India" },
    solkadhi: { region: "Maharashtra", country: "India" },

    // Rajasthani dishes
    "dal baati churma": { region: "Rajasthan", country: "India" },
    "gatte ki sabzi": { region: "Rajasthan", country: "India" },
    "ker sangri": { region: "Rajasthan", country: "India" },
    "laal maas": { region: "Rajasthan", country: "India" },
    "pyaaz kachori": { region: "Rajasthan", country: "India" },
    ghevar: { region: "Rajasthan", country: "India" },
    "bajre ki roti": { region: "Rajasthan", country: "India" },

    // Tamil Nadu dishes
    sambar: { region: "Tamil Nadu", country: "India" },
    rasam: { region: "Tamil Nadu", country: "India" },
    dosa: { region: "Tamil Nadu", country: "India" },
    idli: { region: "Tamil Nadu", country: "India" },
    "chettinad chicken": { region: "Tamil Nadu", country: "India" },
    pongal: { region: "Tamil Nadu", country: "India" },

    // Punjab dishes
    "butter chicken": { region: "Punjab", country: "India" },
    "sarson da saag": { region: "Punjab", country: "India" },
    "makki di roti": { region: "Punjab", country: "India" },
    "chole bhature": { region: "Punjab", country: "India" },
    lassi: { region: "Punjab", country: "India" },

    // West Bengal dishes
    "fish curry": { region: "West Bengal", country: "India" },
    "mishti doi": { region: "West Bengal", country: "India" },
    rosogolla: { region: "West Bengal", country: "India" },
    "kosha mangsho": { region: "West Bengal", country: "India" },
    "macher jhol": { region: "West Bengal", country: "India" },

    // International dishes - ONLY if no explicit style mentioned
    // These will be treated as local adaptations unless explicitly mentioned as "italian pizza"
  }

  // Check for regional dish recognition (but not international dishes like pizza, pasta)
  for (const [dish, origin] of Object.entries(regionalDishes)) {
    if (promptLower.includes(dish)) {
      return {
        type: "regional_dish",
        dish: dish,
        region: origin.region,
        country: origin.country,
      }
    }
  }

  // STEP 4: Check for dishes that should be localized (pizza, pasta, burger, etc.)
  const localizableDishes = [
    "pizza",
    "pasta",
    "burger",
    "sandwich",
    "salad",
    "soup",
    "noodles",
    "fried rice",
    "biryani",
    "curry",
    "bread",
    "cake",
    "cookies",
    "ice cream",
  ]

  for (const dish of localizableDishes) {
    if (promptLower.includes(dish)) {
      return {
        type: "localizable_dish",
        dish: dish,
        region: userLocation?.state || "Local",
        country: userLocation?.country || "Local",
      }
    }
  }

  // STEP 5: Default to user's location
  return {
    type: "local_default",
    region: userLocation?.state || "Local",
    country: userLocation?.country || "Local",
  }
}

// Update the generateRecipe function with enhanced cuisine logic
export async function generateRecipe(prompt, location = null) {
  try {
    // Get current meal type based on user's timezone
    const currentMealType = location?.timezone ? getMealTypeFromTime(location.timezone) : ""

    // Analyze prompt for cuisine preferences
    const cuisineAnalysis = analyzePromptForCuisine(prompt, location)

    // Create enhanced cuisine context based on analysis
    let enhancedCuisineContext = ""

    switch (cuisineAnalysis.type) {
      case "explicit_style":
        enhancedCuisineContext = `
EXPLICIT STYLE REQUEST DETECTED:
- User specifically requested: ${cuisineAnalysis.region} style
- OVERRIDE local default and create recipe in ${cuisineAnalysis.region} style
- Use authentic ${cuisineAnalysis.region} ingredients, spices, and cooking methods
- Mention this is prepared in ${cuisineAnalysis.region} style as requested
- Country context: ${cuisineAnalysis.country}
`
        break

      case "international_cuisine":
        enhancedCuisineContext = `
INTERNATIONAL CUISINE REQUEST:
- User requested ${cuisineAnalysis.cuisine} cuisine
- Create authentic ${cuisineAnalysis.country} recipe
- Use traditional ${cuisineAnalysis.cuisine} ingredients and techniques
- Do NOT localize to ${location?.country || "user location"} unless ingredients unavailable
`
        break

      case "regional_dish":
        enhancedCuisineContext = `
REGIONAL DISH DETECTED:
- Dish "${cuisineAnalysis.dish}" is traditionally from ${cuisineAnalysis.region}, ${cuisineAnalysis.country}
- IMPORTANT: Create authentic ${cuisineAnalysis.region} version of ${cuisineAnalysis.dish}
- Use traditional ${cuisineAnalysis.region} ingredients and cooking methods
- Do NOT adapt to user's current location (${location?.state}) unless explicitly requested
- This dish should reflect authentic ${cuisineAnalysis.region} cuisine
- Explain why this is the traditional ${cuisineAnalysis.region} preparation
`
        break

      case "localizable_dish":
        enhancedCuisineContext = `
LOCALIZABLE DISH DETECTED:
- User mentioned "${cuisineAnalysis.dish}" without specifying cuisine style
- IMPORTANT: Create ${location?.country || "local"} style ${cuisineAnalysis.dish}
- Adapt ${cuisineAnalysis.dish} to local ${location?.state || location?.country || "regional"} tastes and ingredients
- Use local spices, cooking methods, and flavor preferences
- Make it feel authentic to ${location?.city || "local"} food culture
- Example: Indian-style pizza with local toppings, spices, and flavors popular in ${location?.state || "the region"}
`
        break

      case "local_default":
      default:
        enhancedCuisineContext = getLocationCuisineContext(location)
        break
    }

    // Create time-based meal suggestion
    const timeBasedContext = currentMealType
      ? `
TIME-BASED MEAL SUGGESTION:
- Current time suggests: ${currentMealType}
- Unless user specifies otherwise, consider creating a recipe suitable for ${currentMealType}
- Adjust portion sizes, cooking complexity, and ingredients appropriate for ${currentMealType}
- For breakfast: lighter, quicker options
- For lunch: balanced, moderate portions
- For dinner: more substantial, can be more complex
- For snacks: smaller portions, quick preparation
`
      : ""

    const result = await geminiModel.generateContent(`
You are a professional chef and recipe developer with expertise in global cuisines and regional food cultures. Create a detailed, authentic recipe based on this request: "${prompt}"

${enhancedCuisineContext}

${timeBasedContext}

ENHANCED RECIPE ANALYSIS REQUIREMENTS:
${
  cuisineAnalysis.type === "regional_dish"
    ? `- CRITICAL: This is ${cuisineAnalysis.dish} from ${cuisineAnalysis.region}. Create the AUTHENTIC ${cuisineAnalysis.region} version.
  - Do NOT adapt to user's current location (${location?.state}) unless explicitly requested
  - Use traditional ${cuisineAnalysis.region} spices, ingredients, and cooking methods
  - Explain the regional authenticity in the description`
    : cuisineAnalysis.type === "explicit_style"
      ? `- CRITICAL: User explicitly requested ${cuisineAnalysis.region} style. Honor this request completely.
  - Override any location defaults and create authentic ${cuisineAnalysis.region} cuisine
  - Use ${cuisineAnalysis.region} cooking techniques and ingredient preferences`
      : cuisineAnalysis.type === "international_cuisine"
        ? `- CRITICAL: User requested ${cuisineAnalysis.cuisine} cuisine. Create authentic ${cuisineAnalysis.country} recipe.
  - Do NOT localize unless ingredients are unavailable in user's region`
        : `- No specific cuisine mentioned, default to local ${location?.state || location?.country || ""} cuisine
  - Use local ingredients and cooking styles popular in ${location?.city || "the area"}`
}

CUISINE DECISION LOGIC:
1. ✅ Check for explicit style requests (e.g., "rajasthani style", "maharashtrian way")
2. ✅ Check for regional dish recognition (e.g., "puran poli" = Maharashtra dish)
3. ✅ Check for international cuisine mentions (e.g., "italian", "mexican")
4. ✅ Default to user's local cuisine only if none of the above apply

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "Descriptive recipe name reflecting the cuisine choice",
  "description": "Brief but appetizing description of the dish with regional context",
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
  "cuisine": "${
    cuisineAnalysis.type === "explicit_style"
      ? cuisineAnalysis.region + " Style"
      : cuisineAnalysis.type === "international_cuisine"
        ? cuisineAnalysis.cuisine.charAt(0).toUpperCase() + cuisineAnalysis.cuisine.slice(1)
        : cuisineAnalysis.type === "regional_dish"
          ? cuisineAnalysis.region + " " + cuisineAnalysis.country
          : cuisineAnalysis.type === "localizable_dish"
            ? (location?.country || "Local") +
              " Style " +
              cuisineAnalysis.dish.charAt(0).toUpperCase() +
              cuisineAnalysis.dish.slice(1)
            : (location?.state || "Local") + " Cuisine"
  }",
  "nutrition": {
    "calories": realistic_number_per_serving,
    "protein": grams_per_serving,
    "carbs": grams_per_serving,
    "fat": grams_per_serving
  },
  "mealType": "${currentMealType || "any time"}",
  "localAdaptation": "${
    cuisineAnalysis.type === "regional_dish"
      ? `Authentic ${cuisineAnalysis.region} preparation of traditional ${cuisineAnalysis.dish}`
      : cuisineAnalysis.type === "explicit_style"
        ? `Prepared in authentic ${cuisineAnalysis.region} style as requested`
        : cuisineAnalysis.type === "international_cuisine"
          ? `Authentic ${cuisineAnalysis.cuisine} recipe`
          : location
            ? `Adapted for ${location.city}, ${location.state} local preferences`
            : ""
  }",
  "timeAppropriate": "Brief explanation of why this recipe is suitable for ${currentMealType || "the current time"}",
  "cuisineOrigin": "${cuisineAnalysis.region || location?.state || "Local"}"
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
${
  cuisineAnalysis.type === "regional_dish" || cuisineAnalysis.type === "explicit_style"
    ? `- Use authentic ${cuisineAnalysis.region} ingredients and spices`
    : `- Prioritize ingredients available in ${location ? `${location.city}, ${location.state}` : "local markets"}`
}

INSTRUCTION REQUIREMENTS:
- Each instruction should be a complete, clear step
- Include cooking temperatures, times, and visual cues
- Mention when to add seasonings and how much
- Include texture and doneness indicators
- Start each instruction with an action verb
- Consider the complexity appropriate for ${currentMealType || "the meal type"}
${
  cuisineAnalysis.type === "regional_dish" || cuisineAnalysis.type === "explicit_style"
    ? `- Follow authentic ${cuisineAnalysis.region} cooking techniques`
    : ""
}

TAGS MUST BE from this list only: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Low-Carb", "Mediterranean", "Spicy", "Quick", "Healthy", "Comfort Food", "Local Cuisine", "Traditional", "Regional"]

NUTRITION VALUES:
- Calculate realistic values based on ingredients and serving size
- Consider cooking methods that affect calories (frying adds calories, etc.)
- Provide per-serving values
- Adjust portions appropriate for ${currentMealType || "the meal"}

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
    const { days, servings, dietaryPreferences, budget, allergies, location } = preferences

    const dietaryText = dietaryPreferences?.length ? dietaryPreferences.join(", ") : "No specific dietary preferences"
    const allergiesText = allergies?.length ? allergies.join(", ") : "No allergies"
    const budgetText = budget ? `$${budget}` : "flexible budget"

    // Create location context for AI
    let locationContext = ""
    let mealTimingContext = ""

    if (location) {
      locationContext = `
LOCATION CONTEXT:
- User is located in: ${location.city}, ${location.state}, ${location.country}
- Country Code: ${location.countryCode}
- Timezone: ${location.timezone}
- This meal plan should incorporate LOCAL CUISINE and food habits from this region
- Use ingredients and cooking styles that are popular and accessible in ${location.city}, ${location.state}
- Consider seasonal ingredients available in ${location.country}
- Include traditional dishes and flavors from this region when appropriate
- Adapt portion sizes and meal timing to local customs if relevant
- Prioritize ingredients that are commonly found in local markets in ${location.city}

IMPORTANT: Blend the user's dietary preferences with authentic local cuisine from ${location.city}, ${location.state}, ${location.country}. Make the meal plan feel authentic to their location while respecting their dietary needs.`

      // Get culturally appropriate meal timing
      mealTimingContext = getMealTimingContext(location)
    }

    const result = await geminiModel.generateContent(`
You are a professional nutritionist and meal planning expert with deep knowledge of global cuisines, local food cultures, and regional meal timing customs. Create a comprehensive ${days}-day meal plan with these specifications:

USER REQUIREMENTS:
- Number of people: ${servings}
- Dietary preferences: ${dietaryText}
- Allergies/Restrictions: ${allergiesText}
- Budget: ${budgetText}
- Duration: ${days} days

${locationContext}

${mealTimingContext}

MEAL PLANNING PRINCIPLES:
- Create nutritionally balanced meals across all days
- Ensure variety in proteins, vegetables, and cooking methods
- Consider meal prep efficiency and ingredient overlap
- Balance quick meals with more elaborate cooking
- Include seasonal and accessible ingredients
- Respect dietary restrictions completely
- Provide realistic portion sizes and calorie estimates
${location ? `- Incorporate authentic local cuisine from ${location.city}, ${location.state}, ${location.country}` : ""}
${location ? `- Use cooking methods and spices popular in ${location.country}` : ""}
${location ? `- Include traditional breakfast, lunch, and dinner styles from this region` : ""}
${location ? `- CRITICAL: Use meal times that are culturally appropriate for ${location.city}, ${location.state}, ${location.country} based on local eating habits` : ""}

Respond ONLY with a valid JSON object in this exact format:
{
  "days": [
    {
      "day": "Day name (Monday, Tuesday, etc.)",
      "date": "Month Day format",
      "meals": {
        "breakfast": {
          "name": "Specific meal name",
          "time": "Culturally appropriate time for ${location ? `${location.city}, ${location.country}` : "this region"} (e.g., 7:30 AM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the meal",
          "localCuisine": ${location ? "true" : "false"},
          "culturalNote": "${location ? `Brief note about why this time/meal fits ${location.country} culture` : ""}"
        },
        "lunch": {
          "name": "Specific meal name",
          "time": "Culturally appropriate time for ${location ? `${location.city}, ${location.country}` : "this region"} (e.g., 12:30 PM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the meal",
          "localCuisine": ${location ? "true" : "false"},
          "culturalNote": "${location ? `Brief note about why this time/meal fits ${location.country} culture` : ""}"
        },
        "snack": {
          "name": "Culturally appropriate snack",
          "time": "Local snack time for ${location ? `${location.city}, ${location.country}` : "this region"} (e.g., 4:00 PM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the snack",
          "localCuisine": ${location ? "true" : "false"},
          "culturalNote": "${location ? `Brief note about local snacking culture in ${location.country}` : ""}"
        },
        "dinner": {
          "name": "Specific meal name",
          "time": "Culturally appropriate dinner time for ${location ? `${location.city}, ${location.country}` : "this region"} (e.g., 7:00 PM)",
          "calories": realistic_calorie_estimate,
          "prepTime": "X mins",
          "description": "Brief description of the meal",
          "localCuisine": ${location ? "true" : "false"},
          "culturalNote": "${location ? `Brief note about dinner culture in ${location.country}` : ""}"
        }
      },
      "dailyCalories": total_calories_for_the_day,
      "nutritionFocus": "Main nutritional benefit of the day",
      "culturalInsight": "${location ? `Brief insight about how this day's meals reflect ${location.country} food culture` : ""}"
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
  }${
    location
      ? `,
  "localCuisineInfo": {
    "region": "${location.city}, ${location.state}, ${location.country}",
    "timezone": "${location.timezone}",
    "cuisineStyle": "Description of the local cuisine incorporated",
    "localIngredients": ["Key local ingredients used"],
    "culturalNotes": "Brief note about local food culture reflected in the plan",
    "mealTimingCulture": "Explanation of why these meal times are appropriate for ${location.country}"
  }`
      : ""
  }
}

CRITICAL MEAL TIMING REQUIREMENTS:
${location ? `- ALL meal times must be authentic to ${location.city}, ${location.state}, ${location.country} culture` : ""}
${location ? `- Research and apply actual meal timing patterns from ${location.country}` : ""}
${location ? `- Consider work schedules, cultural norms, and family dining traditions in ${location.country}` : ""}
${location ? `- Breakfast time should match when people in ${location.city} typically eat breakfast` : ""}
${location ? `- Lunch time should reflect local business hours and dining culture in ${location.state}` : ""}
${location ? `- Dinner time should match family dining traditions in ${location.country}` : ""}
${location ? `- Snack times should align with cultural practices (tea time, siesta, etc.) in ${location.country}` : ""}

CRITICAL FORMATTING RULES:
- Do NOT use bold formatting (**text**) anywhere
- Do NOT use italic formatting (*text*) anywhere
- Do NOT use markdown formatting of any kind
- Use only plain text in all fields
- Meal names should be specific and appetizing
- Include realistic prep times and calorie estimates
- Shopping list should be organized and practical
- ALL TIMES must be culturally authentic, not generic

MEAL VARIETY REQUIREMENTS:
- No repeated meals within the plan period
- Balance of different protein sources
- Variety of cooking methods (grilled, baked, sautéed, raw, etc.)
- Mix of cuisines while respecting dietary preferences${location ? ` and emphasizing ${location.country} cuisine` : ""}
- Include both familiar and slightly adventurous options
${location ? `- At least 60% of meals should reflect local ${location.city} cuisine and cooking styles` : ""}
${location ? `- Use spices, herbs, and cooking techniques popular in ${location.country}` : ""}

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
${location ? `- Prioritize ingredients commonly available in ${location.city}, ${location.state}` : ""}
${location ? `- Include local/regional ingredients specific to ${location.country} cuisine` : ""}
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
    const { dietaryPreferences, allergies, budget, servings, location } = preferences

    let locationInsightPrompt = ""
    if (location) {
      locationInsightPrompt = `
LOCATION CONTEXT FOR INSIGHTS:
- User location: ${location.city}, ${location.state}, ${location.country}
- User timezone: ${location.timezone}
- Analyze how this meal plan incorporates local ${location.country} cuisine
- Comment on the cultural authenticity and local ingredient usage
- Explain the health benefits of local food traditions included
- Mention seasonal and regional advantages of the selected meals
- Analyze how meal timing aligns with local eating habits in ${location.country}
- Comment on cultural appropriateness of meal times for ${location.city} residents`
    }

    const result = await geminiModel.generateContent(`
You are a certified nutritionist analyzing this meal plan for health and wellness insights.

MEAL PLAN DATA:
${JSON.stringify(mealPlan)}

USER PROFILE:
- Dietary preferences: ${dietaryPreferences?.join(", ") || "None"}
- Allergies/Restrictions: ${allergies?.join(", ") || "None"}
- Budget considerations: ${budget ? `$${budget}` : "Flexible"}
- Serving size: ${servings} people
${location ? `- Location: ${location.city}, ${location.state}, ${location.country}` : ""}
${location ? `- Timezone: ${location.timezone}` : ""}

${locationInsightPrompt}

Analyze this meal plan comprehensively and provide insights on its nutritional value, health benefits, practical advantages, and cultural authenticity.

Respond ONLY with a valid JSON object in this exact format:
{
  "benefits": [
    "Specific health benefit with explanation",
    "Another nutritional advantage",
    "Practical benefit for the user",
    ${location ? `"Cultural benefit of local ${location.country} cuisine integration"` : ""}
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
  "sustainabilityScore": number (1-10, how sustainable this plan is long-term)${
    location
      ? `,
  "localCuisineInsights": "Analysis of how local ${location.country} cuisine enhances this meal plan's nutritional and cultural value",
  "mealTimingAnalysis": "Assessment of how meal times align with local eating habits in ${location.city}, ${location.state}",
  "culturalAuthenticity": number (1-10, how well meal times and foods match local ${location.country} culture)`
      : ""
  }
}

ANALYSIS REQUIREMENTS:
- Evaluate nutritional completeness and balance
- Consider variety and sustainability
- Assess alignment with user's dietary preferences
- Evaluate practical aspects (prep time, cost, accessibility)
- Identify any nutritional gaps or excesses
- Consider meal timing and energy distribution
${location ? `- Analyze the integration of local ${location.city} cuisine and its health benefits` : ""}
${location ? `- Comment on seasonal and regional ingredient advantages` : ""}
${location ? `- Evaluate cultural appropriateness of meal timing for ${location.country}` : ""}
${location ? `- Assess how well the plan reflects authentic ${location.country} eating patterns` : ""}

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
        ...(location ? [`Incorporates authentic ${location.city} local cuisine with appropriate meal timing`] : []),
      ],
      nutritionalHighlights: `Balanced nutrition with appropriate portion sizes${location ? ` featuring local ${location.country} ingredients and culturally appropriate meal times` : ""}.`,
      ...(location
        ? {
            localCuisineInsights: `This meal plan thoughtfully integrates ${location.city} local cuisine with authentic meal timing, providing cultural authenticity while maintaining nutritional balance.`,
            mealTimingAnalysis: `Meal times are carefully selected to match local eating habits in ${location.city}, ${location.state}, making the plan feel natural and sustainable for your lifestyle.`,
          }
        : {}),
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
