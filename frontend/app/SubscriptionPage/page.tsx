"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "lib/firebase"; // your initialized Firebase app
import styles from "../../styles/SubscriptionPage.module.css";

// Initialise Stripe with Publishable Key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentFormProps {
  plan: string;
  priceId: string;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ plan, priceId, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe.js hasn’t loaded yet.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found.");
      setProcessing(false);
      return;
    }

    try {
      // Create a Payment Method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setError(error.message || "Payment method creation failed.");
        setProcessing(false);
        return;
      }

      // Send paymentMethod.id and priceId to backend
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, paymentMethodId: paymentMethod.id }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setProcessing(false);
        return;
      }

      // Handle 3D Secure if required
      if (result.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          result.clientSecret
        );
        if (confirmError) {
          setError(confirmError.message || "3D Secure authentication failed.");
          setProcessing(false);
          return;
        }
      }

      // Subscription successful – optionally persist to Firestore
      const currentUser: FirebaseUser | null = auth.currentUser;
      if (currentUser) {
        await setDoc(doc(db, "subscriptions", currentUser.uid), {
          plan,
          priceId,
          createdAt: new Date().toISOString(),
        });
      }

      alert("Subscription created successfully!");
      onClose();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <h3>Subscribe to {plan} Plan</h3>
      <CardElement
        options={{ style: { base: { color: "#ffffff", fontSize: "16px" } } }}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={styles.submitButton}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
      <button type="button" onClick={onClose} className={styles.cancelButton}>
        Cancel
      </button>
    </form>
  );
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const auth = getAuth();

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const plans = [
    {
      title: "Individual",
      price: "$10",
      priceId: "price_1YourIndividualPriceID", // Replace with actual Stripe Price ID
      description:
        "Ideal for solo creators who want to unlock the full potential of the platform.",
      features: [
        "Ad-free experience",
        "10GB storage for uploads",
        "Access to premium templates",
        "Advanced analytics",
        "Priority email support",
      ],
    },
    {
      title: "Business",
      price: "$25",
      priceId: "price_1YourBusinessPriceID", // Replace with actual Stripe Price ID
      description:
        "Designed for businesses needing advanced features and team collaboration.",
      features: [
        "Ad-free experience",
        "50GB storage for uploads",
        "Access to premium templates",
        "Advanced analytics",
        "Team collaboration (up to 5 users)",
        "24/7 priority support",
      ],
    },
    {
      title: "Family",
      price: "$15",
      priceId: "price_1YourFamilyPriceID", // Replace with actual Stripe Price ID
      description:
        "Great for families or small groups, with shared access for up to 4 members.",
      features: [
        "Ad-free experience",
        "20GB storage for uploads",
        "Access to premium templates",
        "Advanced analytics",
        "Shared access for 4 members",
        "Priority email support",
      ],
    },
  ];

  const handleCloseClick = () => {
    router.push("/dashboard");
  };

  const handleSignUpClick = (plan: string, priceId: string) => {
    setSelectedPlan(plan);
    setSelectedPriceId(priceId);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setSelectedPriceId(null);
  };

  if (!isAuthenticated) {
    return null; // Render nothing until auth check completes
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <i className="fas fa-times"></i>
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Unlock Premium Features</h1>
        <p className={styles.pageSubtitle}>
          Choose the plan that best suits your needs and start creating without
          limits!
        </p>
        <div className={styles.pricingContainer}>
          {plans.map((plan) => (
            <div key={plan.title} className={styles.planCard}>
              <h2 className={styles.planTitle}>{plan.title}</h2>
              <p className={styles.planPrice}>
                {plan.price}
                <span>/month</span>
              </p>
              <p className={styles.planDescription}>{plan.description}</p>
              <ul className={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check-circle"></i> {feature}
                  </li>
                ))}
              </ul>
              <button
                className={styles.signUpButton}
                onClick={() => handleSignUpClick(plan.title, plan.priceId)}
              >
                Sign Up
              </button>
            </div>
          ))}
        </div>
      </main>
      {selectedPlan && selectedPriceId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <Elements stripe={stripePromise}>
              <PaymentForm
                plan={selectedPlan}
                priceId={selectedPriceId}
                onClose={closeModal}
              />
            </Elements>
          </div>
        </div>
      )}
      <footer className={styles.footer}>
        <p className="mb-0">
          <i className="fas fa-copyright"></i> 2025 DorfNewAI. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
