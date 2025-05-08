"use client";

import { CustomToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@/styles/landing.module.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <CustomToastProvider>
              {children}
              <Toaster />
            </CustomToastProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}