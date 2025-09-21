"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { verifyPasswordResetCode, applyActionCode } from "firebase/auth";

export default function HandleAction() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (oobCode) {
      if (mode === "resetPassword") {
        verifyPasswordResetCode(auth, oobCode)
          .then((email) => {
            router.push(`/reset-password?oobCode=${oobCode}&email=${encodeURIComponent(email)}`);
          })
          .catch((error) => {
            console.error("Password reset verification error:", error);
            router.push("/forgot-password?error=" + encodeURIComponent("Invalid or expired reset link. Please try again."));
          });
      } else if (mode === "verifyEmail") {
        applyActionCode(auth, oobCode)
          .then(() => {
            router.push("/login?message=Email verified successfully");
          })
          .catch((error) => {
            console.error("Email verification error:", error);
            router.push("/verify-email?error=" + encodeURIComponent("Invalid or expired verification link."));
          });
      } else {
        router.push("/login?error=invalid-action");
      }
    } else {
      router.push("/login?error=missing-code");
    }
  }, [searchParams, router]);

  return <div>Processing request... Please wait.</div>;
}