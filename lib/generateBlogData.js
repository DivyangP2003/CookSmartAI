import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Example topics
const topics = [
  "How to Use Herbs for Better Flavor in Your Cooking",
  "AI in Modern Kitchens: How Smart Tech is Changing the Way We Cook",
  "Essential Knife Skills Every Home Cook Should Learn",
  "A Beginner's Guide to the Mediterranean Diet",
  "The Truth About Nonstick Pans: What Every Cook Should Know",
];

async function generateBlogPost(topic) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a professional food blogger.

Write a full blog post on: "${topic}".

Include:
- title
- excerpt (1–2 sentences)
- a full blog content (500+ words), structured with markdown (## Headings, **bold**, lists, etc.)
- category from this list: [Recipe Tips, Cooking Techniques, Ingredient Guides, Kitchen Tools, Nutrition, Cultural Cuisine, AI & Technology, Community Stories]
- author name
- readTime
- date
- image (use a placeholder like /placeholder.svg?height=300&width=400&text=Title+Image)
- authorImage (placeholder: initials only)

Respond in a valid JSON object — do NOT wrap it in \`\`\`json or any Markdown.
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  // Clean up if wrapped in code block
  const cleaned = raw
    .replace(/^```json\s*/i, "") // remove ```json at the start
    .replace(/^```\s*/i, "") // or ``` if not labeled
    .replace(/\s*```$/i, "") // remove ``` at the end
    .trim();

  try {
    const blogPost = JSON.parse(cleaned);
    return blogPost;
  } catch (err) {
    console.error("❌ JSON parse error.");
    console.log("🔍 Gemini raw response:", raw);
    throw new Error("Failed to parse Gemini blog post response");
  }
}

// 👇 THIS is the function your API route wants to call
export async function generateAllPosts() {
  const posts = [];

  for (const topic of topics) {
    const post = await generateBlogPost(topic);
    posts.push(post);
  }

  const filePath = path.join(process.cwd(), "blogdata", "blogdata.js");

  const content = `export const blogPosts = ${JSON.stringify(posts, null, 2)};`;

  await fs.writeFile(filePath, content);

  return posts;
}
