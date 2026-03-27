import * as React from "react";

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}
