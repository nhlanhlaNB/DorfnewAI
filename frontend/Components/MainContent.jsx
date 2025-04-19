"use client";
import styles from "../styles/MainContent.module.css";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'

export default function MainContent() {
  const topics = [
    { name: "Sports", color: "#ff6b6b" },
    { name: "Wild Life", color: "#4ecdc4" },
    { name: "Music", color: "#7b68ee" },
    { name: "Videos", color: "#ff8e53" },
  ];

  // Mock subscription data (replace with real data from your backend)
  const subscriptions = [
    {
      channelName: "Nhlanhla’s AI Sports Clips",
      creator: "NhlanhlaBhengu",
      type: "Video",
      preview: "A thrilling AI-generated extreme-sport montage",
      color: "#ff6b6b",
    },
    {
      channelName: "Sara’s AI Music Vibes",
      creator: "SaraTunes",
      type: "Music",
      preview: "Chill beats crafted by AI",
      color: "#7b68ee",
    },
    {
      channelName: "WildLife Wonders",
      creator: "NatureLover",
      type: "Image",
      preview: "Stunning AI wildlife scenes",
      color: "#4ecdc4",
    },
  ];

  const [subscribedChannels, setSubscribedChannels] = useState(subscriptions);

  const handleUnsubscribe = (channelName) => {
    setSubscribedChannels(subscribedChannels.filter((sub) => sub.channelName !== channelName));
  };
  const router = useRouter()

  return (
    <div className={styles.mainContent}>
      {/* Explore Topics Section */}
      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={styles.topicCard}
              style={{ backgroundColor: topic.color }}
            >
              {topic.name}
            </div>
          ))}
        </div>
      </section>

      {/* Your Subscriptions Section */}
      <section className={styles.yourSubscriptions}>
        <h2>Your Subscriptions</h2>
        {subscribedChannels.length > 0 ? (
          <div className={styles.subscriptionsGrid}>
            {subscribedChannels.map((sub) => (
              <div
                key={sub.channelName}
                className={styles.subscriptionCard}
                style={{ borderLeft: `4px solid ${sub.color}` }}
              >
                <div className={styles.channelInfo}>
                  <h3>{sub.channelName}</h3>
                  <p className={styles.creator}>by {sub.creator}</p>
                  <p className={styles.preview}>{sub.preview}</p>
                </div>
                <button
                  className={styles.unsubscribeButton}
                  onClick={() => handleUnsubscribe(sub.channelName)}
                >
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noSubscriptions}>
            You haven’t subscribed to any channels yet. Explore topics to find creators!
          </p>
        )}
      </section>
    </div>
  );
}

