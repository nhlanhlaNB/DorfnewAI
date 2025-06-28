"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../../styles/Library.module.css";
import Header from "../../components/Header";

export default function Library() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("Images");
  const [libraryContent, setLibraryContent] = useState({
    Images: [],
    Videos: [],
    Audio: []
  });
  const generateClickRef = useRef(null);

  // Fetch user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const displayName = userDoc.data()?.name || user.email?.split('@')[0] || 'User';
            setUserName(displayName);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch library content from Firestore
  useEffect(() => {
    const fetchLibraryContent = async () => {
      if (!userId) return;
      
      try {
        const content = { Images: [], Videos: [], Audio: [] };
        
        // Fetch images
        const imagesQuery = query(
          collection(db, "library"),
          where("userId", "==", userId),
          where("type", "==", "image")
        );
        const imagesSnapshot = await getDocs(imagesQuery);
        content.Images = imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch videos
        const videosQuery = query(
          collection(db, "library"),
          where("userId", "==", userId),
          where("type", "==", "video")
        );
        const videosSnapshot = await getDocs(videosQuery);
        content.Videos = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch audio
        const audioQuery = query(
          collection(db, "library"),
          where("userId", "==", userId),
          where("type", "==", "audio")
        );
        const audioSnapshot = await getDocs(audioQuery);
        content.Audio = audioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setLibraryContent(content);
      } catch (error) {
        console.error("Error loading library content:", error);
      }
    };

    fetchLibraryContent();
  }, [userId]);

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleDownload = (content: { src: string; title: any; type: string; }) => {
    const link = document.createElement('a');
    link.href = content.src;
    link.download = `${content.title}.${content.type === 'image' ? 'png' : content.type === 'video' ? 'mp4' : 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (content: { id: string; }, category: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "library", content.id));
      
      // Update local state
      const updatedContent = {
        ...libraryContent,
        [category]: libraryContent[category].filter((item: { id: string; }) => item.id !== content.id)
      };
      setLibraryContent(updatedContent);
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Header onGenerateClick={generateClickRef} />
      
      <main className={styles.mainContent}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>My Library</h1>
          <p className={styles.pageSubtitle}>
            All your generated content in one place
          </p>
        </div>

        {/* Content Type Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'Images' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('Images')}
            style={{ backgroundColor: '#00ddeb' }}
          >
            <i className="fas fa-image"></i> Images
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'Videos' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('Videos')}
            style={{ backgroundColor: '#ff8e53' }}
          >
            <i className="fas fa-video"></i> Videos
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'Audio' ? styles.activeTab : ''}`}
            onClick={() => handleTabChange('Audio')}
            style={{ backgroundColor: '#7b68ee' }}
          >
            <i className="fas fa-music"></i> Audio
          </button>
        </div>

        {/* Content Display */}
        <div className={styles.contentGrid}>
          {libraryContent[activeTab]?.length > 0 ? (
            libraryContent[activeTab].map((content, index) => (
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
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(content, activeTab)}
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
                onClick={() => router.push('../dashboard')}
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