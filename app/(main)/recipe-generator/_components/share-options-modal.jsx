"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  MessageCircle,
  Twitter,
  Instagram,
  Mail,
  Users,
  Briefcase,
  Download,
  ImageOff,
  Info,
} from "lucide-react";
import { useToast } from "@/app/_components/ui/use-toast";

export default function ShareOptionsModal({
  isOpen,
  onClose,
  shareContent,
  recipeTitle,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("casual");
  const [customMessage, setCustomMessage] = useState("");
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  if (!shareContent) return null;

  // Check if we have a valid image
  const hasValidImage =
    shareContent?.recipeImage &&
    shareContent.recipeImage !== "/placeholder.svg" &&
    !imageError;

  const templates = [
    {
      id: "casual",
      name: "Casual",
      icon: MessageCircle,
      description: "Perfect for friends and family",
      content: shareContent.casual,
    },
    {
      id: "social",
      name: "Social Media",
      icon: Instagram,
      description: "Optimized for social platforms",
      content: shareContent.social,
    },
    {
      id: "family",
      name: "Family",
      icon: Users,
      description: "Warm and inclusive tone",
      content: shareContent.family,
    },
    {
      id: "professional",
      name: "Professional",
      icon: Briefcase,
      description: "Clean and informative",
      content: shareContent.professional,
    },
  ];

  const currentContent =
    customMessage ||
    templates.find((t) => t.id === selectedTemplate)?.content ||
    "";

  const downloadImage = async (imageUrl, filename) => {
    if (!hasValidImage) {
      toast({
        title: "No Image Available",
        description: "This recipe doesn't have an image to download",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: "Recipe image saved to your device",
        variant: "success",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description:
          "Unable to download image. The image may not be available.",
        variant: "destructive",
      });
    }
  };

  const copyImageToClipboard = async (imageUrl) => {
    if (!hasValidImage) {
      toast({
        title: "No Image Available",
        description: "This recipe doesn't have an image to copy",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if we're on HTTPS (required for clipboard API)
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        throw new Error("Clipboard API requires HTTPS");
      }

      // Check if clipboard API is supported
      if (!navigator.clipboard || !navigator.clipboard.write) {
        throw new Error("Clipboard API not supported in this browser");
      }

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();

      // Convert to PNG if it's JPEG (better clipboard support)
      let finalBlob = blob;
      if (blob.type === "image/jpeg") {
        finalBlob = await convertToPNG(blob);
      }

      // Try to write to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [finalBlob.type]: finalBlob,
        }),
      ]);

      toast({
        title: "Copied!",
        description: "Recipe image copied to clipboard",
        variant: "success",
      });
    } catch (error) {
      console.error("Copy error:", error);

      // Provide helpful fallback message
      toast({
        title: "Copy Not Supported",
        description:
          "Your browser doesn't support copying images. Try downloading the image instead!",
        variant: "destructive",
      });
    }
  };

  // Helper function to convert JPEG to PNG for better clipboard support
  const convertToPNG = (blob) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(resolve, "image/png");
      };

      img.src = URL.createObjectURL(blob);
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Share content copied to clipboard",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(currentContent);
    window.open(`https://wa.me/?text=${text}`, "_blank");

    // Show helpful tip about image sharing
    if (hasValidImage) {
      setTimeout(() => {
        toast({
          title: "WhatsApp Tip 💡",
          description:
            "Text copied! To add the image, download it first and attach manually in WhatsApp.",
          variant: "default",
        });
      }, 1000);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareContent.social);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");

    if (hasValidImage) {
      setTimeout(() => {
        toast({
          title: "Twitter Tip 💡",
          description:
            "Text shared! You can attach the image manually when composing your tweet.",
          variant: "default",
        });
      }, 1000);
    }
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareContent.shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this ${recipeTitle} recipe!`);
    let body = currentContent;

    // Add image note if available
    if (hasValidImage) {
      body += `\n\nRecipe Image: ${shareContent.recipeImage}`;
    }

    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:?subject=${subject}&body=${encodedBody}`);
  };

  const shareToInstagram = async () => {
    // For Instagram, we'll copy the text and provide instructions
    await copyToClipboard(shareContent.social);

    if (hasValidImage) {
      toast({
        title: "Ready for Instagram! 📸",
        description:
          "Caption copied! Download the image and post both in Instagram app.",
        variant: "success",
      });
    } else {
      toast({
        title: "Instagram Caption Ready! 📝",
        description: "Caption copied to clipboard. Paste in Instagram app!",
        variant: "success",
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Recipe</DialogTitle>
          <DialogDescription>
            Choose how you'd like to share "{recipeTitle}"
          </DialogDescription>
        </DialogHeader>

        {/* Conditional Image Section */}
        {hasValidImage ? (
          <div className="bg-gradient-to-r from-orange-50 to-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Recipe Image</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadImage(
                      shareContent.recipeImage,
                      `${recipeTitle}-recipe.jpg`
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyImageToClipboard(shareContent.recipeImage)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Image
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={shareContent.recipeImage || "/placeholder.svg"}
                alt={recipeTitle}
                className="w-full h-48 object-cover rounded-lg shadow-md"
                onError={handleImageError}
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-white/90 text-gray-800">
                  Perfect for social media! 📸
                </Badge>
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded mt-2 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                <strong>Tip:</strong> Most platforms require manual image
                attachment. Download the image first, then share the text and
                attach the image separately.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <ImageOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                No Image Available
              </h3>
              <p className="text-xs text-gray-500">
                Recipe image couldn't be loaded, but you can still share the
                recipe details!
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Choose a sharing style:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setCustomMessage("");
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {template.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {template.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Preview:</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentContent)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <Textarea
              value={currentContent}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Customize your message..."
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Call to Action */}
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> {shareContent.callToAction}
            </p>
          </div>

          {/* Enhanced Quick Share Buttons */}
          <div>
            <h3 className="text-sm font-medium mb-3">Quick share to:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareToWhatsApp}
                className="bg-green-50 hover:bg-green-100 justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={shareToInstagram}
                className="bg-pink-50 hover:bg-pink-100 justify-start"
              >
                <Instagram className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Instagram</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={shareToTwitter}
                className="bg-blue-50 hover:bg-blue-100 justify-start"
              >
                <Twitter className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Twitter</div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="bg-gray-50 hover:bg-gray-100 justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Email</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Sharing Instructions */}
          {hasValidImage && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                How to Share with Images:
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  • <strong>WhatsApp/Telegram:</strong> Copy text, then download
                  & attach image manually
                </li>
                <li>
                  • <strong>Instagram:</strong> Download image, copy caption,
                  post in app
                </li>
                <li>
                  • <strong>Facebook/Twitter:</strong> Share text first, then
                  add image in the post
                </li>
                <li>
                  • <strong>Email:</strong> Image link is included in the
                  message
                </li>
              </ul>
            </div>
          )}

          {/* Recipe Highlights */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">
              Recipe Highlights:
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">⏱️ {shareContent.prepTime}</Badge>
              <Badge variant="secondary">
                🥘 {shareContent.keyIngredients}
              </Badge>
              <Badge variant="secondary">🤖 AI Generated</Badge>
              {!hasValidImage && <Badge variant="outline">📝 Text Only</Badge>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
