"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import styles from "../../styles/SubscriptionPage.module.css";
import { PLANS } from "../../lib/plans";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);
  const buttonsRendered = useRef<boolean>(false);

  useEffect(() => {
    // Initialize Firebase auth and db
    const authInstance = getAuth();
    const dbInstance = getFirestore();
    setAuth(authInstance);
    setDb(dbInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!paypalReady || !user || !db || buttonsRendered.current) return;

    const renderPayPalButtons = () => {
      PLANS.forEach((plan) => {
        const containerId = `paypal-button-container-${plan.paypalPlanId}`;
        const container = document.getElementById(containerId);
        
        if (container && window.paypal?.Buttons) {
          try {
            window.paypal.Buttons({
              style: {
                shape: "rect",
                color: "gold",
                layout: "vertical",
                label: "subscribe",
                height: 40,
              },
              createSubscription: function (data: any, actions: any) {
                return actions.subscription.create({
                  plan_id: plan.paypalPlanId
                });
              },
              onApprove: async (data: any) => {
                try {
                  const userId = user?.uid;
                  if (!userId) {
                    console.error("No user ID available");
                    alert("Subscription successful, but user data update failed. Please contact support.");
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
                      email: user.email,
                    },
                    { merge: true }
                  );

                  alert(`Thanks for subscribing! Subscription ID: ${data.subscriptionID}`);
                  router.push("/dashboard");
                } catch (error) {
                  console.error("Error updating subscription:", error);
                  alert("Subscription successful, but failed to update user data. Please contact support.");
                }
              },
              onError: (err: any) => {
                console.error("PayPal subscription error:", err);
                alert("An error occurred during subscription. Please try again.");
              },
            }).render(`#${containerId}`);
          } catch (error) {
            console.error(`Error rendering PayPal button for plan ${plan.paypalPlanId}:`, error);
          }
        }
      });
      buttonsRendered.current = true;
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(renderPayPalButtons, 100);
    return () => clearTimeout(timer);
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
        onReady={() => setPaypalReady(true)}
        onError={() => console.error("Failed to load PayPal SDK")}
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
            Subscribe to our Standard plan and start creating without limits!
          </p>
          
          <div className={styles.pricingContainer}>
            {PLANS.map((plan) => (
              <div
                key={plan.paypalPlanId}
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
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle" /> {feature}
                    </li>
                  ))}
                </ul>
                
                {/* PayPal Button Container */}
                <div 
                  id={`paypal-button-container-${plan.paypalPlanId}`}
                  className={styles.paypalButtonContainer}
                />
                
                <p className={styles.contactNote}>
                  Need custom pricing for teams or enterprise? <br />
                  Contact us at <strong>dorfnew@team.com</strong>
                </p>
              </div>
            ))}
          </div>
        </main>
        
        <footer className={styles.footer}>
          <p>
            <i className="fas fa-copyright" /> {new Date().getFullYear()} DorfNewAI. All rights reserved.
          </p>
          <p className={styles.termsLink}>
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
