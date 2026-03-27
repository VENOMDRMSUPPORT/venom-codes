import { useState, useEffect } from "react";
import { toast } from "sonner";

type ToastType = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: ({ title, description, variant = "default" }: ToastType) => {
      if (variant === "destructive") {
        toast.error(title, { description });
      } else {
        toast.success(title, { description });
      }
    },
  };
}
