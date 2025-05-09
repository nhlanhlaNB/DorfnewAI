// src/hooks/toast-context.ts
"use client";
import { createContext, useContext } from "react";

export const ToastContext = createContext<any>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a CustomToastProvider");
  }
  return context;
};
