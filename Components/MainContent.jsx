"use client";
import styles from '../styles/MainContent.module.css';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function MainContent() {
  return (
    <div className={styles.mainContent}>
      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          <div className={styles.topicCard}>Sports</div>
          <div className={styles.topicCard}>Wild Life</div>
          <div className={styles.topicCard}>Music</div>
          <div className={styles.topicCard}>Videos</div>
          {/* Repeat for other topics */}
        </div>
      </section>
      <section className={styles.yourSubscriptions}>
        <h2>Your Subscriptions</h2>
      </section>
    </div>
  );
}

