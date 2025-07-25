import { generateAllPosts } from "@/lib/generateBlogData";

export async function GET() {
  try {
    const result = await generateAllPosts();
    return Response.json({ success: true, posts: result });
  } catch (err) {
    return Response.json({ success: false, error: err.message });
  }
}
