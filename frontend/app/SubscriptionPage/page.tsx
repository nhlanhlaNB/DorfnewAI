// pages/SubscriptionPage.js (or app/SubscriptionPage/page.js)
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/SubscriptionPage.module.css";

export default function SubscriptionPage() {
  const router = useRouter();

  const handleCloseClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          title="Back to Home"
          aria-label="Back to Home"
        >
          {/* Use Font Awesome X icon */}
          <i className="fas fa-times"></i>
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Unlock Premium Features</h1>
        <p className={styles.pageSubtitle}>
          Choose the plan that best suits your needs and start creating without limits!
        </p>
        <div className={styles.pricingContainer}>
          <div className={styles.planCard}>
            <h2 className={styles.planTitle}>Student</h2>
            <p className={styles.planPrice}>$5<span>/month</span></p>
            <p className={styles.planDescription}>
              Perfect for students looking to explore premium features at a discounted rate.
            </p>
            <ul className={styles.planFeatures}>
              <li><i className="fas fa-check-circle"></i> Ad-free experience</li>
              <li><i className="fas fa-check-circle"></i> 5GB storage for uploads</li>
              <li><i className="fas fa-check-circle"></i> Access to premium templates</li>
              <li><i className="fas fa-check-circle"></i> Priority email support</li>
            </ul>
            <button className={styles.signUpButton}>Sign Up</button>
            <p className={styles.planNote}>*Requires student ID verification</p>
          </div>
          <div className={styles.planCard}>
            <h2 className={styles.planTitle}>Individual</h2>
            <p className={styles.planPrice}>$10<span>/month</span></p>
            <p className={styles.planDescription}>
              Ideal for solo creators who want to unlock the full potential of the platform.
            </p>
            <ul className={styles.planFeatures}>
              <li><i className="fas fa-check-circle"></i> Ad-free experience</li>
              <li><i className="fas fa-check-circle"></i> 10GB storage for uploads</li>
              <li><i className="fas fa-check-circle"></i> Access to premium templates</li>
              <li><i className="fas fa-check-circle"></i> Advanced analytics</li>
              <li><i className="fas fa-check-circle"></i> Priority email support</li>
            </ul>
            <button className={styles.signUpButton}>Sign Up</button>
          </div>
          <div className={styles.planCard}>
            <h2 className={styles.planTitle}>Business</h2>
            <p className={styles.planPrice}>$25<span>/month</span></p>
            <p className={styles.planDescription}>
              Designed for businesses needing advanced features and team collaboration.
            </p>
            <ul className={styles.planFeatures}>
              <li><i className="fas fa-check-circle"></i> Ad-free experience</li>
              <li><i className="fas fa-check-circle"></i> 50GB storage for uploads</li>
              <li><i className="fas fa-check-circle"></i> Access to premium templates</li>
              <li><i className="fas fa-check-circle"></i> Advanced analytics</li>
              <li><i className="fas fa-check-circle"></i> Team collaboration (up to 5 users)</li>
              <li><i className="fas fa-check-circle"></i> 24/7 priority support</li>
            </ul>
            <button className={styles.signUpButton}>Sign Up</button>
          </div>
          <div className={styles.planCard}>
            <h2 className={styles.planTitle}>Family</h2>
            <p className={styles.planPrice}>$15<span>/month</span></p>
            <p className={styles.planDescription}>
              Great for families or small groups, with shared access for up to 4 members.
            </p>
            <ul className={styles.planFeatures}>
              <li><i className="fas fa-check-circle"></i> Ad-free experience</li>
              <li><i className="fas fa-check-circle"></i> 20GB storage for uploads</li>
              <li><i className="fas fa-check-circle"></i> Access to premium templates</li>
              <li><i className="fas fa-check-circle"></i> Advanced analytics</li>
              <li><i className="fas fa-check-circle"></i> Shared access for 4 members</li>
              <li><i className="fas fa-check-circle"></i> Priority email support</li>
            </ul>
            <button className={styles.signUpButton}>Sign Up</button>
          </div>
          <div className={styles.planCard}>
            <h2 className={styles.planTitle}>Custom</h2>
            <p className={styles.planPrice}>Contact Us</p>
            <p className={styles.planDescription}>
              Tailored solutions for large teams or unique needs. Let’s build the perfect plan for you.
            </p>
            <ul className={styles.planFeatures}>
              <li><i className="fas fa-check-circle"></i> Custom storage limits</li>
              <li><i className="fas fa-check-circle"></i> Custom user access</li>
              <li><i className="fas fa-check-circle"></i> All premium features</li>
              <li><i className="fas fa-check-circle"></i> Dedicated account manager</li>
              <li><i className="fas fa-check-circle"></i> 24/7 premium support</li>
            </ul>
            <button className={styles.signUpButton}>Get a Quote</button>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p className="mb-0">
          <i className="fas fa-copyright"></i> 2025 Dorfnew. All rights reserved.
        </p>
      </footer>
    </div>
  );
}