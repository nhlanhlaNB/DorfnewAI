"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/../../New/Final DorfnewAI/DorfnewAI/backend/lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}