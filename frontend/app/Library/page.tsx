"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "app/src/components/ui/use-toast";
import styles from "../../styles/Library.module.css";
import Header from "../../Components/Header";
import Image from "next/image"; // ✅ Next.js optimized image

// Define types
interface ContentItem {
  id: string;
  title: string;
  src: string;
  type: "image" | "video" | "audio";
  userId?: string;
  createdAt?: any;
}

interface LibraryContent {
  Images: ContentItem[];
  Videos: ContentItem[];
  Audio: ContentItem[];
}

export default function Library() {
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] =
    useState<keyof LibraryContent>("Images");
  const [libraryContent, setLibraryContent] = useState<LibraryContent>({
    Images: [],
    Videos: [],
    Audio: [],
  });
  const generateClickRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDoc = await getDoc(doc(db, "app_user", user.email!));
          if (userDoc.exists()) {
            setUserName(
              userDoc.data()?.name ||
                user.email?.split("@")[0] ||
                "User"
            );
          } else {
            setUserName(user.email?.split("@")[0] || "User");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUserName(user.email?.split("@")[0] || "User");
          toast({
            title: "Error",
            description: "Failed to fetch user data.",
          });
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  // Fetch content
  useEffect(() => {
    const fetchLibraryContent = async () => {
      if (!userId) return;

      try {
        const content: LibraryContent = {
          Images: [],
          Videos: [],
          Audio: [],
        };

        const fetchCategory = async (
          type: "image" | "video" | "audio",
          key: keyof LibraryContent
        ) => {
          const q = query(
            collection(db, "library"),
            where("userId", "==", userId),
            where("type", "==", type)
          );
          const snap = await getDocs(q);
          content[key] = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ContentItem[];
        };

        await Promise.all([
          fetchCategory("image", "Images"),
          fetchCategory("video", "Videos"),
          fetchCategory("audio", "Audio"),
        ]);

        setLibraryContent(content);

        const urlParams = new URLSearchParams(
          typeof window !== "undefined"
            ? window.location.search
            : ""
        );
        if (urlParams.get("newContent") === "true") {
          toast({
            title: "Content Generated",
            description:
              "Your new content has been added to your library!",
          });
        }
      } catch (error) {
        console.error("Error loading library content:", error);
        toast({
          title: "Error",
          description: `Failed to load library content: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    };

    fetchLibraryContent();
  }, [userId, toast]);

  const handleTabChange = (tab: keyof LibraryContent) => {
    setActiveTab(tab);
  };

  const handleDownload = (content: ContentItem) => {
    const link = document.createElement("a");
    link.href = content.src;
    link.download = `${content.title}.${
      content.type === "image"
        ? "png"
        : content.type === "video"
        ? "mp4"
        : "mp3"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (
    content: ContentItem,
    category: keyof LibraryContent
  ) => {
    try {
      await deleteDoc(doc(db, "library", content.id));
      setLibraryContent((prev) => ({
        ...prev,
        [category]: prev[category].filter(
          (item) => item.id !== content.id
        ),
      }));
      toast({
        title: "Content Deleted",
        description: `${content.title} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: `Failed to delete content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  return (
    <div className={styles.container}>
      <Header onGenerateClick={generateClickRef} hideSearch={true} />

      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>My Library</h1>
          <p className={styles.pageSubtitle}>
            All your generated content in one place
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          {(["Images", "Videos", "Audio"] as (keyof LibraryContent)[]).map(
            (tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${
                  activeTab === tab ? styles.activeTab : ""
                } ${
                  tab === "Images"
                    ? styles.imagesTab
                    : tab === "Videos"
                    ? styles.videosTab
                    : styles.audioTab
                }`}
                onClick={() => handleTabChange(tab)}
                title={`View ${tab}`}
              >
                <i
                  className={`fas ${
                    tab === "Images"
                      ? "fa-image"
                      : tab === "Videos"
                      ? "fa-video"
                      : "fa-music"
                  }`}
                ></i>{" "}
                {tab}
              </button>
            )
          )}
        </div>

        {/* Content grid */}
        <div className={styles.contentGrid}>
          {libraryContent[activeTab]?.length > 0 ? (
            libraryContent[activeTab].map((content) => (
              <div
                key={content.id}
                className={styles.contentCard}
              >
                {content.type === "image" && (
                  <Image
                    src={content.src}
                    alt={content.title}
                    className={styles.mediaPreview}
                    width={500}
                    height={500}
                  />
                )}
                {content.type === "video" && (
                  <video
                    src={content.src}
                    className={styles.mediaPreview}
                    controls
                  />
                )}
                {content.type === "audio" && (
                  <div className={styles.audioContainer}>
                    <audio
                      src={content.src}
                      className={styles.audioPlayer}
                      controls
                    />
                    <div
                      className={styles.audioVisualizer}
                    ></div>
                  </div>
                )}

                <div className={styles.contentInfo}>
                  <h3 className={styles.contentTitle}>
                    {content.title}
                  </h3>
                  <div className={styles.contentActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleDownload(content)}
                      title="Download content"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() =>
                        handleDelete(content, activeTab)
                      }
                      title="Delete content"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <i
                className={`fas ${
                  activeTab === "Images"
                    ? "fa-image"
                    : activeTab === "Videos"
                    ? "fa-video"
                    : "fa-music"
                } ${styles.emptyIcon}`}
              ></i>
              <p>
                No {activeTab.toLowerCase()} in your library yet
              </p>
              <button
                className={styles.generateButton}
                onClick={() => router.push("/dashboard")}
              >
                Generate Some Content
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          <i className="fas fa-copyright"></i> 2025 Dorfnew.
          All rights reserved.
        </p>
      </footer>
    </div>
  );
}
