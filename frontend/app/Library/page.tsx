
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/../../app/src2/components/ui/use-toast";
import styles from "../../styles/Library.module.css";
import Header from '../../Components/Header';

// Define types
interface ContentItem {
  id: string;
  title: string;
  src: string;
  type: 'image' | 'video' | 'audio';
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
  const [activeTab, setActiveTab] = useState<keyof LibraryContent>("Images");
  const [libraryContent, setLibraryContent] = useState<LibraryContent>({
    Images: [],
    Videos: [],
    Audio: [],
  });
  const generateClickRef = useRef(null);

  // Fetch user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDoc = await getDoc(doc(db, "app_user", user.email!));
          if (userDoc.exists()) {
            const displayName = userDoc.data()?.name || user.email?.split('@')[0] || 'User';
            setUserName(displayName);
          } else {
            console.warn("User document not found in app_user");
            setUserName(user.email?.split('@')[0] || 'User');
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUserName(user.email?.split('@')[0] || 'User');
          toast({
            title: "Error",
            description: "Failed to fetch user data.",
            variant: "destructive",
          });
        }
      } else {
        console.warn("No authenticated user. Redirecting to login.");
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  // Fetch library content from Firestore
  useEffect(() => {
    const fetchLibraryContent = async () => {
      if (!userId) {
        console.log("No userId yet, skipping fetch.");
        return;
      }

      try {
        const content: LibraryContent = { Images: [], Videos: [], Audio: [] };

        // Fetch images
        const imagesQuery = query(
          collection(db, "library"),
          where("userId", "==", userId),
          where("type", "==", "image")
        );
        const imagesSnapshot = await getDocs(imagesQuery);
        content.Images = imagesSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as ContentItem[];

        // Fetch videos
        const videosQuery = query(
          collection(db, "library"),
          where("userId", "==", userId),
          where("type", "==", "video")
        );
        const videosSnapshot = await getDocs(videosQuery);
        content.Videos = videosSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as ContentItem[];

        // Fetch audio
        const audioQuery = query(
          collection(db, "library"),
          where("userId", "==", userId),
          where("type", "==", "audio")
        );
        const audioSnapshot = await getDocs(audioQuery);
        content.Audio = audioSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as ContentItem[];

        console.log("Fetched library content:", content);
        setLibraryContent(content);

        // Check for new content
        const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        if (urlParams.get("newContent") === "true") {
          toast({
            title: "Content Generated",
            description: "Your new content has been added to your library!",
          });
        }
      } catch (error) {
        console.error("Error loading library content:", error);
        toast({
          title: "Error",
          description: `Failed to load library content: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      }
    };

    fetchLibraryContent();
  }, [userId, toast]);

  const handleTabChange = (tab: keyof LibraryContent) => {
    setActiveTab(tab);
  };

  const handleDownload = (content: ContentItem) => {
    const link = document.createElement('a');
    link.href = content.src;
    link.download = `${content.title}.${content.type === 'image' ? 'png' : content.type === 'video' ? 'mp4' : 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (content: ContentItem, category: keyof LibraryContent) => {
    try {
      await deleteDoc(doc(db, "library", content.id));
      const updatedContent = {
        ...libraryContent,
        [category]: libraryContent[category].filter((item) => item.id !== content.id),
      };
      setLibraryContent(updatedContent);
      toast({
        title: "Content Deleted",
        description: `${content.title} has been removed from your library.`,
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: `Failed to delete content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
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

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'Images' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('Images')}
            style={{ backgroundColor: '#00ddeb' }}
            title="View Images"
          >
            <i className="fas fa-image"></i> Images
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'Videos' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('Videos')}
            style={{ backgroundColor: '#ff8e53' }}
            title="View Videos"
          >
            <i className="fas fa-video"></i> Videos
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'Audio' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('Audio')}
            style={{ backgroundColor: '#7b68ee' }}
            title="View Audio"
          >
            <i className="fas fa-music"></i> Audio
          </button>
        </div>

        <div className={styles.contentGrid}>
          {libraryContent[activeTab]?.length > 0 ? (
            libraryContent[activeTab].map((content: ContentItem, index: number) => (
              <div key={content.id || index} className={styles.contentCard}>
                {content.type === 'image' && (
                  <img
                    src={content.src}
                    alt={content.title}
                    className={styles.mediaPreview}
                  />
                )}
                {content.type === 'video' && (
                  <video
                    src={content.src}
                    className={styles.mediaPreview}
                    controls
                  />
                )}
                {content.type === 'audio' && (
                  <div className={styles.audioContainer}>
                    <audio
                      src={content.src}
                      className={styles.audioPlayer}
                      controls
                    />
                    <div className={styles.audioVisualizer}></div>
                  </div>
                )}
                <div className={styles.contentInfo}>
                  <h3 className={styles.contentTitle}>{content.title}</h3>
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
                      onClick={() => handleDelete(content, activeTab)}
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
              <i className={`fas ${activeTab === 'Images' ? 'fa-image' : activeTab === 'Videos' ? 'fa-video' : 'fa-music'} ${styles.emptyIcon}`}></i>
              <p>No {activeTab.toLowerCase()} in your library yet</p>
              <button
                className={styles.generateButton}
                onClick={() => router.push('/dashboard')}
              >
                Generate Some Content
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          <i className="fas fa-copyright"></i> 2025 Dorfnew. All rights reserved.
        </p>
      </footer>
    </div>
  );
}