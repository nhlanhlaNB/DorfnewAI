"use client";

import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "destructive";
}

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  toast: (options: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a CustomToastProvider");
  }
  return context;
};

interface CustomToastProviderProps {
  children: ReactNode;
}

export const CustomToastProvider = ({
  children,
}: CustomToastProviderProps): JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
    setTimeout(() => removeToast(toast.id), 5000); // Auto-remove after 5s
  }, [removeToast]);

  const toast = useCallback(
    ({ title, description, action, variant }: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      addToast({ id, title, description, action, variant });
    },
    [addToast]
  );

  if (process.env.NODE_ENV === "development") {
    console.log("CustomToastProvider children:", children);
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};