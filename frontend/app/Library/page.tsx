"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import styles from "../../styles/Library.module.css";

interface MediaItem {
  id: string;
  type: "image" | "video" | "audio";
  src: string;
  title: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

interface Topic {
  name: string;
  color: string;
}

export default function LibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  // Updated topics array (removed Sports and Wild Life)
  const topics: Topic[] = [
    { name: "Music", color: "#7b68ee" },
    { name: "Videos", color: "#ff8e53" },
    { name: "Images", color: "#00ddeb" },
  ];

  // Hardcoded media data (removed sports-related items)
  const dummyMedia = {
    Videos: [
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/1519477/1519477-hd_1920_1080_30fps.mp4",
        title: "Nature Video 1",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/3209298/3209298-hd_1920_1080_25fps.mp4",
        title: "Nature Video 2",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_30fps.mp4",
        title: "Nature Video 3",
      },
    ],
    Images: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        title: "Image 1",
      },
      {
        type: "image",
        src: "https://pics.craiyon.com/2023-10-31/93234f8584254bf88c6d27430f35cba2.webp",
        title: "Image 2",
      },
      {
        type: "image",
        src: "https://png.pngtree.com/thumb_back/fh260/background/20240506/pngtree-a-boat-on-a-lake-in-autumn-image_15669075.jpg",
        title: "Image 3",
      },
    ],
    Music: [
      {
        type: "audio",
        src: "https://cdn.pixabay.com/audio/2023/03/20/audio_7c92e8b6df.mp3",
        title: "Instrumental Track 1",
      },
      {
        type: "audio",
        src: "https://cdn.pixabay.com/audio/2022/08/02/audio_34488e04fd.mp3",
        title: "Instrumental Track 2",
      },
      {
        type: "audio",
        src: "https://cdn.pixabay.com/audio/2023/10/25/audio_508e9b4631.mp3",
        title: "Instrumental Track 3",
      },
    ],
  };

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.error("No authenticated user found. Redirecting to login.");
        router.push("/login");
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Store hardcoded dummyMedia in Firebase on first load
  useEffect(() => {
    if (user) {
      const storeHardcodedMedia = async () => {
        try {
          const existingItems = await getDocs(
            query(collection(db, "library"), where("userId", "==", user.uid))
          );
          const existingTitles = existingItems.docs.map((doc) => doc.data().title);

          // Store dummyMedia items if they don't already exist
          const allMedia = [
            ...dummyMedia.Videos,
            ...dummyMedia.Images,
            ...dummyMedia.Music,
          ];

          for (const item of allMedia) {
            if (!existingTitles.includes(item.title)) {
              const docId = `${user.uid}_${Date.now()}_${item.title.replace(/\s+/g, "_")}`;
              await setDoc(doc(db, "library", docId), {
                userId: user.uid,
                type: item.type,
                src: item.src,
                title: item.title,
                createdAt: new Date(),
              });
              console.log(`Stored hardcoded item: ${item.title}`);
            }
          }

          // Fetch media items after storing
          fetchMediaItems();
        } catch (err: unknown) {
          console.error("Error storing hardcoded media:", (err as Error).message);
          setError("Failed to initialize library. Please try again.");
        }
      };

      storeHardcodedMedia();
    }
  }, [user]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "library"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const items: MediaItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type as "image" | "video" | "audio",
        src: doc.data().src,
        title: doc.data().title,
        createdAt: doc.data().createdAt,
      }));
      setMediaItems(items);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Error fetching library items:", (err as Error).message);
      setError("Failed to load library items. Please check your Firebase configuration or network connection.");
      setLoading(false);
    }
  };

  const deleteMediaItem = async (itemId: string) => {
    if (!user) {
      setError("You must be logged in to delete items.");
      return;
    }

    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "library", itemId));
      await fetchMediaItems();
      alert("Item deleted successfully!");
    } catch (err: unknown) {
      console.error("Error deleting item:", (err as Error).message);
      setError("Failed to delete item. Please try again.");
    }
  };

  const handleTopicClick = (topicName: string) => {
    setSelectedCategory(topicName);
  };

  const closeMedia = () => {
    setSelectedCategory(null);
  };

  const handleGenerateRedirect = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className={styles.libraryContainer}>
        <div className={styles.iconContainer}>
          <i className="fas fa-book" title="Library"></i>
        </div>
        <div className={styles.loader}></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.iconContainer}>
        <i className="fas fa-book" title="Library"></i>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={`${styles.topicCard} ${styles[`topic${topic.name.replace(" ", "")}`]}`}
              style={{ background: topic.color }}
              onClick={() => handleTopicClick(topic.name)}
            >
              {topic.name}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.mediaDisplay}>
        <h3>Media Library</h3>
        {mediaItems.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Your library is empty</h2>
            <p>Generate content to add videos, images, or audio to your library</p>
            <button
              className={styles.addButton}
              onClick={handleGenerateRedirect}
            >
              Generate Your First Video, Image, or Audio
            </button>
          </div>
        ) : (
          <div className={styles.mediaGrid}>
            {mediaItems
              .filter((item) =>
                selectedCategory ? item.title.includes(selectedCategory) : true
              )
              .map((item) => (
                <div key={item.id} className={styles.mediaCard}>
                  <div className={styles.mediaActions}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteMediaItem(item.id)}
                      title="Delete item"
                    >
                      ×
                    </button>
                  </div>
                  {item.type === "image" && (
                    <>
                      <Image
                        src={item.src}
                        alt={item.title}
                        className={styles.mediaContent}
                        width={400}
                        height={300}
                        unoptimized
                        loading="eager"
                      />
                      <a
                        href={item.src}
                        download={`${item.title}.jpg`}
                        className={styles.downloadButton}
                        title={`Download ${item.title}`}
                      >
                        Download
                      </a>
                    </>
                  )}
                  {item.type === "video" && (
                    <video
                      className={styles.mediaContent}
                      controls
                      src={item.src}
                      title={item.title}
                    />
                  )}
                  {item.type === "audio" && (
                    <audio
                      className={styles.mediaContent}
                      controls
                      src={item.src}
                      title={item.title}
                    />
                  )}
                  <p className={styles.mediaTitle}>{item.title}</p>
                  <p className={styles.mediaDate}>
                    {item.createdAt
                      ? new Date(item.createdAt.seconds * 1000).toLocaleString()
                      : "Date not available"}
                  </p>
                </div>
              ))}
          </div>
        )}
        {selectedCategory && (
          <button className={styles.closeButton} onClick={closeMedia}>
            Close
          </button>
        )}
      </section>
    </div>
  );
}
