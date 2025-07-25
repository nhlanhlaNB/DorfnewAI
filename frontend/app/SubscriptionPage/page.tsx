'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import styles from '../../styles/SubscriptionPage.module.css';

interface Plan {
  title: string;
  price: string;
  description: string;
  features: string[];
  paypalPlanId: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    title: 'Individual',
    price: '$10',
    description: 'Ideal for solo creators who want to unlock the full potential of the platform.',
    features: [
      'Ad‑free experience',
      '10 GB storage for uploads',
      'Access to premium templates',
      'Advanced analytics',
      'Priority e‑mail support',
    ],
    paypalPlanId: 'P-4SW2058640943662UNBTJI6Y',
  },
  {
    title: 'Business',
    price: '$35',
    description: 'Designed for businesses needing advanced features and team collaboration.',
    features: [
      'Ad‑free experience',
      '50 GB storage for uploads',
      'Access to premium templates',
      'Advanced analytics',
      'Team collaboration (up to 5 users)',
      '24/7 priority support',
    ],
    paypalPlanId: 'P-3JC40256EM658594HNBUFIBA',
    popular: true,
  },
  {
    title: 'Family',
    price: '$25',
    description: 'Great for families or small groups, with shared access for up to 4 members.',
    features: [
      'Ad‑free experience',
      '20 GB storage for uploads',
      'Access to premium templates',
      'Advanced analytics',
      'Shared access for 4 members',
      'Priority e‑mail support',
    ],
    paypalPlanId: 'P-3CS59433TT1532629NBT25SQ',
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const rendered = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const off = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => off();
  }, [auth, router]);

  useEffect(() => {
    if (!paypalReady || !user) return;

    plans.forEach((plan) => {
      const container = document.getElementById(
        `paypal-button-container-${plan.paypalPlanId}`,
      );
      if (
        container &&
        !rendered.current[plan.paypalPlanId] &&
        (window as any).paypal?.Buttons
      ) {
        (window as any).paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'subscribe',
          },
          createSubscription: (_data: any, actions: any) =>
            actions.subscription.create({ plan_id: plan.paypalPlanId }),
          onApprove: async (data: any) => {
            try {
              // Update Firestore with subscription details
              const userDocRef = doc(db, "app_user", user.email);
              await setDoc(userDocRef, {
                subscribed: true,
                planId: plan.paypalPlanId,
                subscriptionId: data.subscriptionID,
                price: plan.price.replace('$', ''), // e.g., "10.00"
                updatedAt: serverTimestamp(),
              }, { merge: true });

              alert(`Thanks for subscribing!\nSubscription ID: ${data.subscriptionID}`);
              router.push('/dashboard'); // Redirect to dashboard after successful subscription
            } catch (error) {
              console.error("Error updating subscription:", error);
              alert("Subscription successful, but failed to update user data. Please contact support.");
            }
          },
          onError: (err: any) => {
            console.error("PayPal subscription error:", err);
            alert("An error occurred during subscription. Please try again.");
          },
        }).render(container);

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
      <head>
        <title>Subscription Plans</title>
        <meta
          name="description"
          content="Choose the plan that best suits your needs"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </head>
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <button
            className={styles.closeButton}
            onClick={() => router.push('/dashboard')}
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
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={`${styles.planCard} ${
                  plan.popular ? styles.popularPlan : ''
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
            <i className="fas fa-copyright" /> {new Date().getFullYear()} 
            DorfNewAI. All rights reserved.
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
