"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Library.module.css";


export default function Library() {
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
        <h1 className={styles.pageTitle}>My Library</h1>
        <p className={styles.pageSubtitle}>
          Access all your generated AI content, organized and ready to use.
        </p>
        <div className={styles.contentContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Saved Projects</h2>
            <p className={styles.cardDescription}>
              View and edit your saved AI-generated articles, images, and more.
            </p>
            <button className={styles.actionButton}>Explore Projects</button>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Shared Content</h2>
            <p className={styles.cardDescription}>
              Manage content shared with your team or collaborators.
            </p>
            <button className={styles.actionButton}>View Shared</button>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Favorites</h2>
            <p className={styles.cardDescription}>
              Quickly access your favorite AI-generated outputs.
            </p>
            <button className={styles.actionButton}>See Favorites</button>
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