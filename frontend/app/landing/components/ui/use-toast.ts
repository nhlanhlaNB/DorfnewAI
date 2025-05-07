// src/app/landing/components/ui/use-toast.ts
import { useState, useCallback, createContext, useContext, ReactNode } from "react";

interface Toast {
  id: string;
  title: string;
  description: string;
  action?: ReactNode;
}

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Toast) => {
      setToasts((prevToasts) => [...prevToasts, toast]);
    },
    []
  );

  const removeToast = useCallback(
    (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
