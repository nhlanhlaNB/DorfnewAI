"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Image from "next/image";
import styles from "../../styles/Library.module.css";

interface MediaItem {
  type: "image" | "video" | "audio";
  src: string;
  title: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
}

export default function LibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMediaItems = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user found. Redirecting to login.");
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const q = query(
          collection(db, "library"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const items: MediaItem[] = querySnapshot.docs.map(doc => ({
          type: doc.data().type as "image" | "video" | "audio",
          src: doc.data().src,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
        }));
        setMediaItems(items);
        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching library items:", (err as Error).message);
        setError("Failed to load library items.");
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, [router]);

  if (loading) {
    return <div className={styles.libraryContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.libraryContainer}>{error}</div>;
  }

  return (
    <div className={styles.libraryContainer}>
      <h1>Your Library</h1>
      {mediaItems.length === 0 ? (
        <p className={styles.noItems}>No items in your library yet.</p>
      ) : (
        <div className={styles.mediaGrid}>
          {mediaItems.map((item, index) => (
            <div key={index} className={styles.mediaCard}>
              {item.type === "image" && (
                <>
                  <Image
                    src={item.src}
                    alt={item.title}
                    className={styles.mediaContent}
                    width={400}
                    height={300}
                    unoptimized
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
    </div>
  );
}
 