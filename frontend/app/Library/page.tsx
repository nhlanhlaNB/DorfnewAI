"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
      { type: "video", src: "https://videos.pexels.com/video-files/1519477/1519477-hd_1920_1080_30fps.mp4", title: "Nature Video 1" },
      { type: "video", src: "https://videos.pexels.com/video-files/3209298/3209298-hd_1920_1080_25fps.mp4", title: "Nature Video 2" },
      { type: "video", src: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_30fps.mp4", title: "Nature Video 3" },
    ],
    Images: [
      { type: "image", src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", title: "Image 1" },
      { type: "image", src: "https://pics.craiyon.com/2023-10-31/93234f8584254bf88c6d27430f35cba2.webp", title: "Image 2" },
      { type: "image", src: "https://png.pngtree.com/thumb_back/fh260/background/20240506/pngtree-a-boat-on-a-lake-in-autumn-image_15669075.jpg", title: "Image 3" },
    ],
    Music: [
      { type: "audio", src: "https://cdn.pixabay.com/audio/2023/03/20/audio_7c92e8b6df.mp3", title: "Instrumental Track 1" },
      { type: "audio", src: "https://cdn.pixabay.com/audio/2022/08/02/audio_34488e04fd.mp3", title: "Instrumental Track 2" },
      { type: "audio", src: "https://cdn.pixabay.com/audio/2023/10/25/audio_508e9b4631.mp3", title: "Instrumental Track 3" },
    ],
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Store hardcoded media and migrate library
  useEffect(() => {
    if (!user) return;

    const storeAndMigrate = async () => {
      try {
        const existingDocs = await getDocs(query(collection(db, "library"), where("userId", "==", user.uid)));
        const existingTitles = existingDocs.docs.map(d => d.data().title);

        const allMedia = [...dummyMedia.Videos, ...dummyMedia.Images, ...dummyMedia.Music];
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
          }
        }

        // Migrate missing fields
        const querySnapshot = await getDocs(query(collection(db, "library"), where("userId", "==", user.uid)));
        const typeToCategory: Record<"image" | "video" | "audio", string> = { image: "Images", video: "Videos", audio: "Music" };
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data() as LibraryDocument;
          const updates: Partial<LibraryDocument> = {};
          if (!data.category && data.type) updates.category = typeToCategory[data.type];
          if (data.isFavorite === undefined) updates.isFavorite = false;
          if (Object.keys(updates).length > 0) await setDoc(docSnap.ref, updates, { merge: true });
        }

        fetchMediaItems();
      } catch (err: unknown) {
        setError("Failed to initialize library.");
        console.error(err);
      }
    };

    storeAndMigrate();
  }, [user]);

  // Fetch media items safely
  const fetchMediaItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const libraryRef = collection(db, "library");

      let q;
      if (selectedCategory) {
        q = query(libraryRef, where("userId", "==", user.uid), where("category", "==", selectedCategory), orderBy("createdAt", "desc"));
      } else {
        q = query(libraryRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      }

      const snapshot = await getDocs(q);
      const items: MediaItem[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          type: data.type,
          src: data.src,
          title: data.title,
          category: data.category,
          isFavorite: data.isFavorite || false,
          createdAt: data.createdAt || null,
        };
      });

      const filteredItems = searchQuery
        ? items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : items;

      setMediaItems(filteredItems);
      setLoading(false);
    } catch (err: unknown) {
      setError("Failed to fetch library items.");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, [user, selectedCategory, searchQuery]);

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "library", id), { isFavorite: !isFavorite });
      setMediaItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !isFavorite } : i));
    } catch (err) {
      console.error(err);
      setError("Failed to update favorite.");
    }
  };

  const deleteMediaItem = async (id: string) => {
    setShowDeleteModal(id);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;
    try {
      await deleteDoc(doc(db, "library", showDeleteModal));
      setMediaItems(prev => prev.filter(i => i.id !== showDeleteModal));
      setShowDeleteModal(null);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError("Failed to delete item.");
      setShowDeleteModal(null);
    }
  };

  const closeModals = () => {
    setShowDeleteModal(null);
    setShowSuccessModal(false);
    setPreviewItem(null);
  };

  if (loading) {
    return (
      <div className={styles.libraryContainer}>
        <FaBook className={styles.iconContainer} />
        <div className={styles.loader}></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  return (
    <div className={styles.libraryContainer}>
      <FaBook className={styles.iconContainer} />
      {error && <div className={styles.error}>{error} <button onClick={() => setError(null)}>Dismiss</button></div>}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure?</p>
            <button className={styles.modalButton} onClick={confirmDelete}>Yes</button>
            <button className={styles.modalCancelButton} onClick={closeModals}>Cancel</button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Deleted Successfully!</h3>
            <button className={styles.modalButton} onClick={closeModals}>OK</button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className={styles.previewModal}>
          <div className={styles.previewContent}>
            <button className={styles.closePreview} onClick={closeModals} aria-label="Close preview" title="Close preview"><FaTimes /></button>
            {previewItem.type === "image" && <Image src={previewItem.src} alt={previewItem.title} width={800} height={600} unoptimized />}
            {previewItem.type === "video" && <video src={previewItem.src} controls autoPlay />}
            {previewItem.type === "audio" && <audio src={previewItem.src} controls autoPlay />}
            <h3>{previewItem.title}</h3>
          </div>
        </div>
      )}

      {/* Search */}
      <div className={styles.searchBar}>
        <FaSearch />
        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Topics */}
      <div className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map(topic => (
            <div key={topic.name} style={{ background: topic.color }} onClick={() => setSelectedCategory(topic.name)}>{topic.name}</div>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className={styles.mediaDisplay}>
        {mediaItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Your library is empty.</p>
            <button onClick={() => router.push("/dashboard")}>Generate Content</button>
          </div>
        ) : (
          <div className={styles.mediaGrid}>
            {mediaItems.map(item => (
              <Tilt key={item.id}>
                <div className={styles.mediaCard} onClick={() => setPreviewItem(item)}>
                  <button
                    type="button"
                    aria-label={item.isFavorite ? `Unfavorite ${item.title}` : `Favorite ${item.title}`}
                    title={item.isFavorite ? `Unfavorite ${item.title}` : `Favorite ${item.title}`}
                    onClick={e => { e.stopPropagation(); toggleFavorite(item.id, item.isFavorite || false); }}
                  >
                    <FaHeart className={item.isFavorite ? styles.favorited : ""} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.title}`}
                    title={`Delete ${item.title}`}
                    onClick={e => { e.stopPropagation(); deleteMediaItem(item.id); }}
                  >
                    <FaTrash />
                  </button>
            
                  {item.type === "image" && <Image src={item.src} alt={item.title} width={400} height={300} unoptimized />}
                  {item.type === "video" && <video src={item.src} muted />}
                  {item.type === "audio" && <div>{item.title}</div>}
            
                  <p>{item.title}</p>
                </div>
              </Tilt>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

