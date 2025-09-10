"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
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
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import { FaSearch, FaHeart, FaTimes, FaBook, FaTrash } from "react-icons/fa";
import styles from "../../styles/Library.module.css";

interface MediaItem {
  id: string;
  type: "image" | "video" | "audio";
  src: string;
  title: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  category?: string;
  isFavorite?: boolean;
}

interface LibraryDocument {
  userId: string;
  type: "image" | "video" | "audio";
  src: string;
  title: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  category?: string;
  isFavorite?: boolean;
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
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const router = useRouter();

  const topics: Topic[] = [
    { name: "Music", color: "#7b68ee" },
    { name: "Videos", color: "#ff8e53" },
    { name: "Images", color: "#00ddeb" },
  ];

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

  useEffect(() => {
    if (user) {
      const storeHardcodedMedia = async () => {
        try {
          const existingItems = await getDocs(
            query(collection(db, "library"), where("userId", "==", user.uid))
          );
          const existingTitles = existingItems.docs.map((doc) => doc.data().title);

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
                category: item.type === "image" ? "Images" : item.type === "video" ? "Videos" : "Music",
                createdAt: new Date(),
                isFavorite: false,
              });
              console.log(`Stored hardcoded item: ${item.title}`);
            }
          }

          await migrateLibraryDocuments();
          fetchMediaItems();
        } catch (err: unknown) {
          console.error("Error storing hardcoded media:", (err as Error).message);
          setError("Failed to initialize library. Please try again.");
        }
      };

      storeHardcodedMedia();
    }
  }, [user]);

  const migrateLibraryDocuments = async () => {
    if (!user) return;
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "library"), where("userId", "==", user.uid))
      );
      const typeToCategory: { [key in "image" | "video" | "audio"]: string } = {
        image: "Images",
        video: "Videos",
        audio: "Music",
      };
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data() as LibraryDocument;
        const updates: Partial<LibraryDocument> = {};
        if (!data.category && data.type) {
          updates.category = typeToCategory[data.type];
        }
        if (data.isFavorite === undefined) {
          updates.isFavorite = false;
        }
        if (Object.keys(updates).length > 0) {
          await setDoc(docSnap.ref, updates, { merge: true });
          console.log(`Updated document ${docSnap.id} with:`, updates);
        }
      }
    } catch (err: unknown) {
      console.error("Error migrating library documents:", (err as Error).message);
    }
  };

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      console.log("Fetching media for user:", user?.uid, "category:", selectedCategory);

      // Use "in" query for all categories when selectedCategory is null
      let q = query(
        collection(db, "library"),
        where("userId", "==", user?.uid),
        where("category", selectedCategory ? "==" : "in", selectedCategory || ["Images", "Videos", "Music"]),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const allItems: MediaItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type as "image" | "video" | "audio",
        src: doc.data().src,
        title: doc.data().title,
        createdAt: doc.data().createdAt,
        category: doc.data().category,
        isFavorite: doc.data().isFavorite || false,
      }));

      // Apply client-side search filter
      const filteredItems = searchQuery
        ? allItems.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allItems;

      console.log(`Fetched ${allItems.length} items, filtered to ${filteredItems.length} for search: "${searchQuery}"`);
      setMediaItems(filteredItems);
      setLoading(false);
    } catch (err: unknown) {
      console.error("Error fetching library items:", (err as Error).message);
      setError("Failed to load library items. Please check your Firebase configuration or network connection.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMediaItems();
    }
  }, [user, selectedCategory, searchQuery]);

  const toggleFavorite = async (itemId: string, isFavorite: boolean) => {
    if (!user) {
      setError("You must be logged in to favorite items.");
      return;
    }
    try {
      await updateDoc(doc(db, "library", itemId), { isFavorite: !isFavorite });
      setMediaItems(mediaItems.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !isFavorite } : item
      ));
    } catch (err: unknown) {
      console.error("Error toggling favorite:", (err as Error).message);
      setError("Failed to update favorite status. Please try again.");
    }
  };

  const deleteMediaItem = async (itemId: string) => {
    if (!user) {
      setError("You must be logged in to delete items.");
      return;
    }
    const item = mediaItems.find((i) => i.id === itemId);
    console.log("Delete button clicked for item:", itemId, "Type:", item?.type, "User:", user.uid);
    setPreviewItem(null); // Prevent preview modal from opening
    setShowDeleteModal(itemId);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) {
      console.log("No item selected for deletion");
      return;
    }
    const item = mediaItems.find((i) => i.id === showDeleteModal);
    console.log("Confirming deletion for item:", showDeleteModal, "Category:", item?.category);
    try {
      await deleteDoc(doc(db, "library", showDeleteModal));
      setMediaItems(mediaItems.filter((item) => item.id !== showDeleteModal));
      setShowDeleteModal(null);
      setShowSuccessModal(true);
      console.log("Item deleted successfully:", showDeleteModal);
    } catch (err: unknown) {
      console.error("Error deleting item:", showDeleteModal, "Details:", (err as Error).message);
      setError("Failed to delete item. Please try again.");
      setShowDeleteModal(null);
    }
  };

  const closeModals = () => {
    setShowDeleteModal(null);
    setShowSuccessModal(false);
    setPreviewItem(null);
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
          <FaBook title="Library" aria-label="Library icon" />
        </div>
        <div className={styles.loader}></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.iconContainer}>
        <FaBook title="Library" aria-label="Library icon" />
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)} aria-label="Dismiss error">Dismiss</button>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className={styles.modalActions}>
              <button className={styles.modalButton} onClick={confirmDelete} aria-label="Confirm delete">
                Yes, Delete
              </button>
              <button className={styles.modalCancelButton} onClick={closeModals} aria-label="Cancel delete">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Success</h3>
            <p>Item deleted successfully!</p>
            <div className={styles.modalActions}>
              <button className={styles.modalButton} onClick={closeModals} aria-label="Close success modal">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {previewItem && (
        <div className={styles.previewModal}>
          <div className={styles.previewContent}>
            <button
              className={styles.closePreview}
              onClick={closeModals}
              aria-label="Close preview"
            >
              <FaTimes />
            </button>
            {previewItem.type === "image" && (
              <Image
                src={previewItem.src}
                alt={previewItem.title}
                className={styles.previewMedia}
                width={800}
                height={600}
                unoptimized
              />
            )}
            {previewItem.type === "video" && (
              <video
                className={styles.previewMedia}
                controls
                src={previewItem.src}
                title={previewItem.title}
                autoPlay
              />
            )}
            {previewItem.type === "audio" && (
              <audio
                className={styles.previewMedia}
                controls
                src={previewItem.src}
                title={previewItem.title}
                autoPlay
              />
            )}
            <h3>{previewItem.title}</h3>
            <p>
              {previewItem.createdAt
                ? new Date(previewItem.createdAt.seconds * 1000).toLocaleString()
                : "Date not available"}
            </p>
          </div>
        </div>
      )}

      <section className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Search media items"
        />
      </section>

      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={`${styles.topicCard} ${styles[`topic${topic.name.replace(" ", "")}`]}`}
              style={{ background: topic.color }}
              onClick={() => handleTopicClick(topic.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleTopicClick(topic.name)}
              aria-label={`Filter by ${topic.name}`}
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
            <button className={styles.addButton} onClick={handleGenerateRedirect} aria-label="Generate new content">
              Generate Your First Video, Image, or Audio
            </button>
          </div>
        ) : (
          <div className={styles.mediaGrid}>
            {mediaItems.map((item) => (
              <Tilt key={item.id} tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} transitionSpeed={400}>
                <div
                  className={styles.mediaCard}
                  onClick={() => setPreviewItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setPreviewItem(item)}
                  aria-label={`View ${item.title}`}
                >
                  <div className={styles.mediaActions}>
                    <button
                      className={styles.favoriteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id, item.isFavorite || false);
                      }}
                      aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <FaHeart className={item.isFavorite ? styles.favorited : ""} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMediaItem(item.id);
                      }}
                      aria-label="Delete item"
                    >
                      <FaTrash />
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
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Download ${item.title}`}
                      >
                        Download
                      </a>
                    </>
                  )}
                  {item.type === "video" && (
                    <video
                      className={styles.mediaContent}
                      src={item.src}
                      title={item.title}
                      muted
                      style={{ pointerEvents: "none" }} // Prevent video from capturing clicks
                    />
                  )}
                  {item.type === "audio" && (
                    <div className={styles.audioPlaceholder}>
                      <FaHeart className={styles.audioIcon} />
                      <p>{item.title}</p>
                    </div>
                  )}
                  <p className={styles.mediaTitle}>{item.title}</p>
                  <p className={styles.mediaDate}>
                    {item.createdAt
                      ? new Date(item.createdAt.seconds * 1000).toLocaleString()
                      : "Date not available"}
                  </p>
                </div>
              </Tilt>
            ))}
          </div>
        )}
        {selectedCategory && (
          <button className={styles.closeButton} onClick={closeMedia} aria-label="Close category filter">
            Close
          </button>
        )}
      </section>
    </div>
  );
}
