"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  deleteDoc,
  doc
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import styles from "../../styles/uploads.module.css";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: { seconds: number; nanoseconds: number };
  userId: string;
}

export default function Uploads() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchUploads(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUploads = async (userId: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "uploads"),
        where("userId", "==", userId),
        orderBy("uploadedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const files: UploadedFile[] = [];
      
      querySnapshot.forEach((doc) => {
        files.push({
          id: doc.id,
          ...doc.data()
        } as UploadedFile);
      });
      
      setUploads(files);
    } catch (err: any) {
      console.error("Error fetching uploads:", err);
      setError("Failed to load uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const handleUploadClick = () => {
    alert("File upload functionality would be implemented here");
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "uploads", fileId));
      setUploads(uploads.filter(u => u.id !== fileId));
    } catch (err: any) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const getFileIcon = (type: string): string => {
    if (type.startsWith("image/")) return "fas fa-file-image";
    if (type.startsWith("video/")) return "fas fa-file-video";
    if (type.startsWith("audio/")) return "fas fa-file-audio";
    if (type === "application/pdf") return "fas fa-file-pdf";
    if (type.includes("word") || type.includes("document")) return "fas fa-file-word";
    if (type.includes("sheet") || type.includes("excel")) return "fas fa-file-excel";
    return "fas fa-file";
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p>Loading your uploads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          title="Back to Home"
          aria-label="Back to Home"
        >
          <i className="fas fa-times"></i>
        </button>
      </header>
      
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Uploads</h1>
        <p className={styles.pageSubtitle}>
          {uploads.length > 0 
            ? `You have ${uploads.length} uploaded file${uploads.length !== 1 ? 's' : ''}`
            : "Upload files to generate AI content or manage existing uploads."
          }
        </p>

        {error && (
          <div className={styles.errorBanner}>
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className={styles.uploadContainer}>
          <div className={styles.uploadCard} onClick={handleUploadClick}>
            <div className={styles.uploadIcon}>
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h2 className={styles.cardTitle}>Upload New File</h2>
            <p className={styles.cardDescription}>
              Upload documents, images, or other files for AI processing.
            </p>
            <button className={styles.actionButton}>
              Start Upload
            </button>
          </div>
        </div>

        {uploads.length > 0 && (
          <div className={styles.uploadsList}>
            <h2 className={styles.sectionTitle}>Your Uploaded Files</h2>
            <div className={styles.filesGrid}>
              {uploads.map((file) => (
                <div key={file.id} className={styles.fileCard}>
                  <div className={styles.filePreview}>
                    {file.type.startsWith("image/") ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={100}
                        height={100}
                        className={styles.previewImage}
                      />
                    ) : (
                      <i className={`${getFileIcon(file.type)} ${styles.fileIcon}`}></i>
                    )}
                  </div>
                  
                  <div className={styles.fileInfo}>
                    <h3 className={styles.fileName}>{file.name}</h3>
                    <div className={styles.fileMeta}>
                      <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                      <span className={styles.fileDate}>{formatDate(file.uploadedAt)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.fileActions}>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      title="Download file"
                    >
                      <i className="fas fa-download"></i>
                    </a>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(file.id)}
                      title="Delete file"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          <i className="fas fa-copyright"></i> 2025 Dorfnew. All rights reserved.
        </p>
      </footer>
    </div>
  );
}