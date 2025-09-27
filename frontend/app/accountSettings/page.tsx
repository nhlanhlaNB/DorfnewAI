"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged, User, deleteUser } from "firebase/auth";
import styles from "../../styles/accountSettings.module.css";
import { PLANS } from "../../lib/plans";

export default function AccountSettings() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/login");
        return;
      }
      setUser(u);
      await fetchUserData(u.uid);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) setUserData(userDoc.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      setUpdating(true);

      // 1️⃣ Call backend to cancel on PayPal
      const res = await fetch("/api/paypal/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "PayPal cancel request failed");
      }

      // 2️⃣ Optimistic update
      await updateDoc(doc(db, "users", user.uid), {
        subscription: "free",
        subscriptionStatus: "cancelled",
        cancelledAt: new Date().toISOString(),
      });

      setUserData({ ...userData, subscription: "free", subscriptionStatus: "cancelled" });
      alert("Your subscription has been cancelled.");
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      alert("Failed to cancel subscription. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleResumeSubscription = async () => {
    if (!user) return;
    if (!confirm("Resume your subscription?")) return;

    try {
      setUpdating(true);

      const res = await fetch("/api/paypal/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "PayPal resume request failed");
      }

      await updateDoc(doc(db, "users", user.uid), {
        subscriptionStatus: "active",
      });

      setUserData({ ...userData, subscriptionStatus: "active" });
      alert("Your subscription has been resumed.");
    } catch (error) {
      console.error("Error resuming subscription:", error);
      alert("Failed to resume subscription. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("Are you absolutely sure you want to permanently delete your account?")) return;

    try {
      setUpdating(true);

      // Delete Firestore user doc
      await deleteDoc(doc(db, "users", user.uid));

      // Delete Firebase Authentication account
      await deleteUser(user);

      alert("Your account has been deleted.");
      router.push("/"); // redirect to home/landing
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        alert("Please log in again to delete your account.");
        router.push("/login");
      } else {
        alert("Failed to delete account. Try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Loading your account information...</p>
        </div>
      </div>
    );
  }

  const currentPlanKey = userData?.subscription || "free";
  const currentPlan =
    PLANS.find((p: any) => p.key === currentPlanKey) ||
    PLANS.find((p: any) => p.key === "free") ||
    PLANS[0];

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={() => router.push("/dashboard")}
          title="Back to Dashboard"
        >
          <i className="fas fa-times"></i>
        </button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Manage Account</h1>
        <div className={styles.settingsContainer}>
          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Subscription</h2>
            <p>
              Current Plan: <b>{currentPlan.title}</b>
            </p>

            {/* Active subscription */}
            {currentPlanKey !== "free" && userData?.subscriptionStatus !== "cancelled" && (
              <>
                <p>{currentPlan.price}/month</p>
                <button
                  className={styles.cancelButton}
                  onClick={handleCancelSubscription}
                  disabled={updating}
                >
                  {updating ? "Processing..." : "Cancel Subscription"}
                </button>
              </>
            )}

            {/* Cancelled but still resumable */}
            {userData?.subscriptionStatus === "cancelled" && (
              <button
                className={styles.actionButton}
                onClick={handleResumeSubscription}
                disabled={updating}
              >
                {updating ? "Processing..." : "Resume Subscription"}
              </button>
            )}

            {/* Free plan */}
            {currentPlanKey === "free" && userData?.subscriptionStatus !== "cancelled" && (
              <button
                className={styles.actionButton}
                onClick={() => router.push("/SubscriptionPage")}
              >
                Upgrade Plan
              </button>
            )}
          </div>

          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Danger Zone</h2>
            <p>Delete your account permanently. This cannot be undone.</p>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteAccount}
              disabled={updating}
            >
              {updating ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
