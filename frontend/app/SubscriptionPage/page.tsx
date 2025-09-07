"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import styles from "../../styles/SubscriptionPage.module.css";
import { PLANS } from "../../lib/plans"; // ✅ import shared plans

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);
  const rendered = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authInstance = getAuth();
      const dbInstance = getFirestore();
      setAuth(authInstance);
      setDb(dbInstance);

      const off = onAuthStateChanged(authInstance, (u) => {
        if (!u) {
          router.push("/login");
        } else {
          setUser(u);
        }
        setLoading(false);
      });
      return () => off();
    }
  }, [router]);

  useEffect(() => {
    if (!paypalReady || !user || !db) return;

    PLANS.forEach((plan) => {
      const container = document.getElementById(
        `paypal-button-container-${plan.paypalPlanId}`
      );
      if (
        container &&
        !rendered.current[plan.paypalPlanId] &&
        (window as any).paypal?.Buttons
      ) {
        (window as any).paypal
          .Buttons({
            style: {
              shape: "rect",
              color: "gold",
              layout: "vertical",
              label: "subscribe",
            },
            createSubscription: (_data: any, actions: any) =>
              actions.subscription.create({ plan_id: plan.paypalPlanId }),
            onApprove: async (data: any) => {
              try {
                const userId = user?.email ?? user?.uid;
                if (!userId) {
                  console.error(
                    "No authenticated user identifier available to update subscription."
                  );
                  alert(
                    "Subscription successful, but failed to update user data because user info is missing. Please contact support."
                  );
                  router.push("/dashboard");
                  return;
                }
                const userDocRef = doc(db, "app_user", userId);
                await setDoc(
                  userDocRef,
                  {
                    subscribed: true,
                    planId: plan.paypalPlanId,
                    subscriptionId: data.subscriptionID,
                    price: plan.price.replace("$", ""),
                    updatedAt: serverTimestamp(),
                  },
                  { merge: true }
                );

                alert(
                  `Thanks for subscribing!\nSubscription ID: ${data.subscriptionID}`
                );
                router.push("/dashboard");
              } catch (error) {
                console.error("Error updating subscription:", error);
                alert(
                  "Subscription successful, but failed to update user data. Please contact support."
                );
              }
            },
            onError: (err: any) => {
              console.error("PayPal subscription error:", err);
              alert("An error occurred during subscription. Please try again.");
            },
          })
          .render(container);

        rendered.current[plan.paypalPlanId] = true;
      }
    });
  }, [paypalReady, user, db, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
        <p>Initializing application…</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=AV4Blmjwp981Sl85YsvLyCpdJC1qCdRnZ-Y6jzQNcFtEr9laPnG8zt3fQffQpBUmUzEo0UUlBd_McFGe&vault=true&intent=subscription"
        strategy="afterInteractive"
        data-sdk-integration-source="button-factory"
        onLoad={() => setPaypalReady(true)}
      />

      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <button
            className={styles.closeButton}
            onClick={() => router.push("/dashboard")}
            aria-label="Back to dashboard"
          >
            <i className="fas fa-times" />
          </button>
        </header>
        <main className={styles.main}>
          <h1 className={styles.pageTitle}>Unlock Premium Features</h1>
          <p className={styles.pageSubtitle}>
            Choose the plan that best suits your needs and start creating
            without limits!
          </p>
          <div className={styles.pricingContainer}>
            {PLANS.map((plan) => (
              <div
                key={plan.title}
                className={`${styles.planCard} ${
                  plan.popular ? styles.popularPlan : ""
                }`}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}
                <h2 className={styles.planTitle}>{plan.title}</h2>
                <p className={styles.planPrice}>
                  {plan.price}
                  <span>/month</span>
                </p>
                <p className={styles.planDescription}>{plan.description}</p>
                <ul className={styles.planFeatures}>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <i className="fas fa-check-circle" /> {f}
                    </li>
                  ))}
                </ul>
                <div
                  id={`paypal-button-container-${plan.paypalPlanId}`}
                  className={styles.paypalButtonContainer}
                />
              </div>
            ))}
          </div>
        </main>
        <footer className={styles.footer}>
          <p>
            <i className="fas fa-copyright" /> {new Date().getFullYear()} DorfNewAI.
            All rights reserved.
          </p>
          <p className={styles.termsLink}>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Terms of Service"
            >
              Terms of Service
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
