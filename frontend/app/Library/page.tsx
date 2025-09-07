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
  addDoc,
  doc,
  deleteDoc 
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

export default function LibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [newItemTitle, setNewItemTitle] = useState<string>("");
  const [newItemUrl, setNewItemUrl] = useState<string>("");
  const [newItemType, setNewItemType] = useState<"image" | "video" | "audio">("image");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const router = useRouter();

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

  // Fetch media items when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMediaItems();
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
      const items: MediaItem[] = querySnapshot.docs.map(doc => ({
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
      setError("Failed to load library items.");
      setLoading(false);
    }
  };

  const saveMediaItem = async () => {
    if (!user) {
      setError("You must be logged in to save items.");
      return;
    }

    if (!newItemTitle || !newItemUrl) {
      setError("Please provide both a title and URL.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await addDoc(collection(db, "library"), {
        userId: user.uid,
        type: newItemType,
        src: newItemUrl,
        title: newItemTitle,
        createdAt: new Date(),
      });

      // Reset form and refresh items
      setNewItemTitle("");
      setNewItemUrl("");
      setShowAddForm(false);
      await fetchMediaItems();
      
      alert("Item saved successfully!");
    } catch (err: unknown) {
      console.error("Error saving item:", (err as Error).message);
      setError("Failed to save item.");
    } finally {
      setSaving(false);
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
      setError("Failed to delete item.");
    }
  };

  if (loading) {
    return (
      <div className={styles.libraryContainer}>
        <div className={styles.loader}></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.header}>
        <h1>Your Library</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {showAddForm && (
        <div className={styles.addForm}>
          <h2>Add New Item</h2>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Enter a title for your media"
            />
          </div>
          <div className={styles.formGroup}>
            <label>URL:</label>
            <input
              type="url"
              value={newItemUrl}
              onChange={(e) => setNewItemUrl(e.target.value)}
              placeholder="Paste the URL of your media"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newItemType">Type:</label>
            <select
              id="newItemType"
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as "image" | "video" | "audio")}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <button 
            className={styles.saveButton}
            onClick={saveMediaItem}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Item"}
          </button>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {mediaItems.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Your library is empty</h2>
          <p>Add items to your library to access them later</p>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            + Add Your First Item
          </button>
        </div>
      ) : (
        <div className={styles.mediaGrid}>
          {mediaItems.map((item) => (
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
 