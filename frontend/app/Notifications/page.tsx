"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import styles from "../../styles/Notifications.module.css";

export default function Notifications() {
  const router = useRouter();

  const handleCloseClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          title="Back to Dashboard"
          aria-label="Back to Dashboard"
        >
          <FaTimes />
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Notifications</h1>
        <p className={styles.pageSubtitle}>
          Your notifications will appear here
        </p>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h2 className={styles.emptyTitle}>No notifications yet</h2>
          <p className={styles.emptyMessage}>
            When you have new alerts or updates, they will show up here.
          </p>
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