import styles from '../styles/MainContent.module.css';
import Image from 'next/image';
import React from 'react';

export default function MainContent() {
  return (
    <div className={styles.mainContent}>
      <section className={styles.trendingCreators}>
        <h2>Trending creators</h2>
        <div className={styles.creatorsList}>
          <div className={styles.creator}>
            <Image src="/path-to-image" alt="Creator" width={50} height={50} />
            <div className={styles.creatorInfo}>
              <p>Aranktu</p>
              <p>Creating FIFA Tools</p>
            </div>
          </div>
          {/* Repeat for other creators */}
        </div>
      </section>
      <section className={styles.exploreTopics}>
        <h2>Explore topics</h2>
        <div className={styles.topicsGrid}>
          <div className={styles.topicCard}>Podcasts & shows</div>
          <div className={styles.topicCard}>Tabletop games</div>
          <div className={styles.topicCard}>Music</div>
          {/* Repeat for other topics */}
        </div>
      </section>
    </div>
  );
}
