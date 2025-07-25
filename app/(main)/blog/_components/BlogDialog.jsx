import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  User,
  X,
  LucideTally1 as VisuallyHidden,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function BlogDialog({ post, open, onOpenChange }) {
  if (!post) return null;

  const authorName = post.authorName || post.author || "Unknown Author";

  // Function to process content and add images at appropriate places
  const processContent = (content) => {
    const paragraphs = content.split("\n\n");
    const processedContent = [];

    // Sample images for demonstration - in a real app, these would come from your data
    const sampleImages = [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];

    let imageIndex = 0;

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        // Add paragraph
        processedContent.push(
          <div key={`para-${index}`} className="mb-6">
            {paragraph.split("\n").map((line, lineIndex) => {
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={lineIndex}
                    className="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b border-gray-200 pb-2"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              } else if (line.startsWith("### ")) {
                return (
                  <h3
                    key={lineIndex}
                    className="text-xl font-semibold text-gray-800 mb-3 mt-6"
                  >
                    {line.replace("### ", "")}
                  </h3>
                );
              } else if (line.startsWith("*   ")) {
                return (
                  <li
                    key={lineIndex}
                    className="ml-6 mb-2 text-gray-700 leading-relaxed list-disc"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace("*   ", "")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </li>
                );
              } else if (line.trim()) {
                return (
                  <p
                    key={lineIndex}
                    className="text-gray-700 leading-relaxed mb-4 text-justify"
                    dangerouslySetInnerHTML={{
                      __html: line
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="font-semibold text-gray-900">$1</strong>'
                        )
                        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>'),
                    }}
                  />
                );
              }
              return null;
            })}
          </div>
        );

        // Add image after every 3-4 paragraphs (when sentence is complete)
        if (
          (index + 1) % 4 === 0 &&
          imageIndex < sampleImages.length &&
          paragraph.trim().endsWith(".")
        ) {
          processedContent.push(
            <div key={`image-${imageIndex}`} className="my-8">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={sampleImages[imageIndex]}
                  alt={`Blog illustration ${imageIndex + 1}`}
                  className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            </div>
          );
          imageIndex++;
        }
      }
    });

    return processedContent;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="sr-only">{post.title}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white shadow-md rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <ScrollArea className="h-[95vh]">
            {/* Hero Section */}
            <div className="relative h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
              <img
                src={
                  post.image ||
                  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Category Badge */}
              <Badge className="absolute top-6 left-6 bg-white/95 text-gray-900 hover:bg-white font-medium px-3 py-1">
                {post.category}
              </Badge>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl font-bold leading-tight mb-4 drop-shadow-lg">
                  {post.title}
                </h1>
              </div>
            </div>

            <div className="p-8">
              {/* Author and Meta Information */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {post.authorImage}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        {authorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-lg text-gray-700 leading-relaxed italic font-medium">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6">{processContent(post.content)}</div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {post.authorImage}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {authorName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Published on {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {post.category}
                  </Badge>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
