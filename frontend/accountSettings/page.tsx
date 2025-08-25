"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/accountSettings.module.css";

export default function AccountSettings() {
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
        <h1 className={styles.pageTitle}>Manage Account</h1>
        <p className={styles.pageSubtitle}>
          Customize your profile, preferences, and security settings.
        </p>
        <div className={styles.settingsContainer}>
          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Profile</h2>
            <p className={styles.cardDescription}>
              Update your name, email, and profile picture.
            </p>
            <button className={styles.actionButton}>Edit Profile</button>
          </div>
          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Preferences</h2>
            <p className={styles.cardDescription}>
              Set your content generation preferences and notifications.
            </p>
            <button className={styles.actionButton}>Manage Preferences</button>
          </div>
          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>Security</h2>
            <p className={styles.cardDescription}>
              Change your password and enable two-factor authentication.
            </p>
            <button className={styles.actionButton}>Security Settings</button>
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