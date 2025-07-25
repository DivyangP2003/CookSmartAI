"use client";

import recommendationPrompts from "@/scripts/recommendation-data";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function RecommendationPrompts({ onPromptSelect, isVisible }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendationPrompts.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative mt-6 bg-gradient-to-r from-orange-100 to-green-100 border border-orange-200 p-5 rounded-xl shadow-md transition-all duration-300 overflow-hidden">
      <p className="text-sm text-gray-700 font-semibold mb-2 flex items-center gap-1">
        🍽️ Recipe Idea Prompt
      </p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onPromptSelect(recommendationPrompts[currentIndex])}
          className="flex-1 text-left text-lg font-medium text-orange-700 hover:text-orange-900 transition-colors fade-in"
          key={currentIndex}
        >
          “{recommendationPrompts[currentIndex]}”
        </button>
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % recommendationPrompts.length)
          }
          className="ml-4 text-orange-500 hover:text-orange-700"
          title="Next idea"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Scoped CSS for fade-in */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
