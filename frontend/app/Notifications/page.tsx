"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Notifications.module.css";

export default function Notifications() {
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
          <i className="fas fa-times"></i>
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Notifications</h1>
        <p className={styles.pageSubtitle}>
          Stay updated with the latest alerts and updates from your AI content generator.
        </p>
        <div className={styles.notificationContainer}>
          <div className={styles.notificationCard}>
            <h2 className={styles.cardTitle}>System Updates</h2>
            <p className={styles.cardDescription}>
              Check for new features and improvements to the platform.
            </p>
            <button className={styles.actionButton}>View Updates</button>
          </div>
          <div className={styles.notificationCard}>
            <h2 className={styles.cardTitle}>Content Alerts</h2>
            <p className={styles.cardDescription}>
              Get notified when your AI-generated content is ready.
            </p>
            <button className={styles.actionButton}>See Alerts</button>
          </div>
          <div className={styles.notificationCard}>
            <h2 className={styles.cardTitle}>Account Notices</h2>
            <p className={styles.cardDescription}>
              Review important account-related notifications.
            </p>
            <button className={styles.actionButton}>Check Notices</button>
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