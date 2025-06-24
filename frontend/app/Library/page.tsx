"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/../../backend/lib/supabase";
import styles from "../../styles/Library.module.css";
import Header from "../../components/Header";

export default function Library() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [activeTab, setActiveTab] = useState("Images");
  const [libraryContent, setLibraryContent] = useState({
    Images: [],
    Videos: [],
    Audio: []
  });
  const generateClickRef = useRef(null);

  // Fetch user name from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (user) {
          const { data, error } = await supabase
            .from('app_user')
            .select('name')
            .eq('email', user.email)
            .single();

          if (error) throw error;

          const displayName = data?.name || user.email?.split('@')[0] || 'User';
          setUserName(displayName);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  // Fetch library content from localStorage (or Supabase if you prefer)
  useEffect(() => {
    const fetchLibraryContent = () => {
      try {
        const savedContent = JSON.parse(localStorage.getItem('dorfnewLibrary')) || {
          Images: [],
          Videos: [],
          Audio: []
        };
        setLibraryContent(savedContent);
      } catch (error) {
        console.error("Error loading library content:", error);
      }
    };

    fetchLibraryContent();
    
    // Also listen for storage events in case content is added from another tab
    window.addEventListener('storage', fetchLibraryContent);
    return () => window.removeEventListener('storage', fetchLibraryContent);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDownload = (content) => {
    const link = document.createElement('a');
    link.href = content.src;
    link.download = `${content.title}.${content.type === 'image' ? 'png' : content.type === 'video' ? 'mp4' : 'mp3'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (content, category) => {
    const updatedContent = {
      ...libraryContent,
      [category]: libraryContent[category].filter(item => item.src !== content.src)
    };
    setLibraryContent(updatedContent);
    localStorage.setItem('dorfnewLibrary', JSON.stringify(updatedContent));
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
              <div key={index} className={styles.contentCard}>
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