"use client";

import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

export function useToast() {
  const toast = ({ title, description, variant = "default" }) => {
    let icon, textClass;

    switch (variant) {
      case "success":
        icon = <CheckCircle className="text-green-600" />;
        textClass = "text-green-600";
        break;
      case "error":
        icon = <XCircle className="text-red-600" />;
        textClass = "text-red-600";
        break;
      default:
        icon = undefined;
        textClass = "text-black";
    }

    sonnerToast(title, {
      description,
      icon,
      className: `bg-white border border-gray-300 ${textClass}`,
    });
  };

  return { toast };
}
