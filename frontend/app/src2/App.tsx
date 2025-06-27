"use client";
import { Toaster } from "@/../../app/src2/components/ui/toaster";
import { Toaster as Sonner } from "@/../../app/src2/components/ui/sonner";
import { TooltipProvider } from "@/../../app/src2/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "lib/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Pages are handled by Next.js routing */}
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;