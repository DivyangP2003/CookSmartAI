import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req) {
  try {
    // ✅ Check if API key is configured before initializing
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured")
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please set GEMINI_API_KEY environment variable.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    // ✅ Protect against invalid JSON
    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    const latestUserMessage = messages[messages.length - 1]?.content || ""

    if (!latestUserMessage.trim()) {
      return new Response(JSON.stringify({ error: "Empty message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })

    // ✅ Start chat with updated system instruction
    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `You are CookSmartAI, an expert cooking, diet, and nutrition assistant.
Follow these rules:
1. Do NOT use Markdown or formatting characters (*, **, ***).
2. Always respond in clean plain text.
3. Use this structure when giving recipes or instructions:
   Title:
   Ingredients:
   Steps:
   Tips:
4. Use numbered or hyphenated lists, but no * symbols.
5. Keep responses concise and practical.`,
          },
        ],
      },
    })

    // Send message and get response
    const result = await chat.sendMessage(latestUserMessage)
    let responseText = result.response.text()

    if (!responseText) {
      throw new Error("Empty response from AI model")
    }

    // ✅ Remove Markdown-style symbols if the model outputs them
    responseText = responseText
      .replace(/\*\*\*(.*?)\*\*\*/g, "$1") // remove ***
      .replace(/\*\*(.*?)\*\*/g, "$1")     // remove **
      .replace(/\*(.*?)\*/g, "$1")         // remove *

    return new Response(
      JSON.stringify({
        id: Date.now().toString(),
        role: "assistant",
        content: responseText,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Chat API Error:", error)

    let errorMessage = "Error processing chat request"
    if (error.message?.includes("API_KEY")) {
      errorMessage = "Invalid API key. Please check your GEMINI_API_KEY key configuration."
    } else if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later."
    } else if (error.message?.includes("network")) {
      errorMessage = "Network error. Please check your connection and try again."
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
