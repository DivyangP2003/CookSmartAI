// Pollinations.ai - Completely FREE, no API key, no limits!
export async function generateRecipeImagePollinations(
  recipeTitle,
  description = ""
) {
  try {
    // Create a detailed prompt for food photography
    const prompt = `Professional food photography of ${recipeTitle}. ${
      description ? description + ". " : ""
    }High quality, appetizing, well-lit, restaurant style presentation, shallow depth of field, garnished beautifully, on a clean white plate, natural lighting, 4K resolution`;

    // Pollinations.ai API - completely free!
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&model=flux&enhance=true&nologo=true&seed=${seed}`;

    // Test if the image loads properly
    const response = await fetch(imageUrl, { method: "GET" });
    if (response.ok) {
      console.log("✅ Image generated via Pollinations:", imageUrl);
      return imageUrl;
    }

    throw new Error("Image generation failed");
  } catch (error) {
    console.error("Pollinations AI Image Generation Error:", error);
    // Return a placeholder image URL as fallback
    throw error; // ✅ Re-throw so fallback works
  }
}

// Hugging Face - Free tier with good daily limits (1000 requests/month)
export async function generateRecipeImageHuggingFace(
  recipeTitle,
  description = ""
) {
  try {
    const prompt = `Professional food photography of ${recipeTitle}. ${
      description ? description + ". " : ""
    }High quality, appetizing, well-lit, restaurant style presentation, shallow depth of field, garnished beautifully, on a clean white plate, natural lighting. Random ID: ${Date.now()}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Free API key
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 800,
            height: 600,
            num_inference_steps: 4,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    // Convert blob to base64 data URL for immediate use
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    console.log("✅ Image generated via Hugging Face (base64)");

    return dataUrl;
  } catch (error) {
    console.error("Hugging Face Image Generation Error:", error);
    // Fallback to Pollinations if HF fails
    return generateRecipeImagePollinations(recipeTitle, description);
  }
}

// export async function generateRecipeImage(recipeTitle, description = "") {
//   console.log("🧪 Forcing Hugging Face image generation (test mode)");
//   return await generateRecipeImageHuggingFace(recipeTitle, description);
// }

// Main entry point: regular recipe image
export async function generateRecipeImage(recipeTitle, description = "") {
  try {
    return await generateRecipeImagePollinations(recipeTitle, description);
  } catch (error) {
    console.error(
      "Primary image generation failed, trying Hugging Face:",
      error
    );
  }

 if (process.env.HUGGINGFACE_API_KEY) {
  try {
    return await generateRecipeImageHuggingFace(recipeTitle, description);
  } catch (error) {
    console.error("Hugging Face fallback failed:", error);
  }
}

  try {
    return await generateRecipeImageAlternative(recipeTitle, description);
  } catch (error) {
    console.error("Alternative image services failed:", error);
  }

  return `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(
    recipeTitle
  )}`;
}

// NEW FUNCTION: Styled image generation
export async function generateStyledRecipeImage(
  recipeTitle,
  style = "professional"
) {
  let description = "";

  switch (style) {
    case "rustic":
      description =
        "rustic, warm lighting, wooden table, homemade look, natural textures";
      break;
    case "modern":
      description =
        "minimalist plating, marble background, soft shadows, white dishware";
      break;
    case "gourmet":
      description =
        "elegant gourmet plating, fine dining, upscale restaurant style";
      break;
    default:
      description =
        "realistic lighting, shallow depth of field, appetizing, soft shadows";
  }

  return await generateRecipeImage(recipeTitle, description);
}
