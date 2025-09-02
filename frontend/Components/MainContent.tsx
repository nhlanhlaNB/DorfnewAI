"use client";

import styles from "../styles/MainContent.module.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Define interfaces for data structures
interface MediaItem {
  type: "image" | "video" | "audio";
  src: string;
  title: string;
}

interface GeneratedContent {
  type: "image" | "video" | "audio";
  src?: string;
  title?: string;
  items?: MediaItem[];
}

interface Subscription {
  channelName: string;
  creator: string;
  type: string;
  preview: string;
  color: string;
}

interface Topic {
  name: string;
  color: string;
}

interface DummyMedia {
  Videos: MediaItem[];
  Images: MediaItem[];
  Music: MediaItem[];
}

interface MainContentProps {
  onGenerateClick: React.MutableRefObject<((value: string) => void) | null>;
}

export default function MainContent({ onGenerateClick }: MainContentProps) {
  const router = useRouter();
  const generateHandlerRef = useRef<((value: string) => void) | null>(null);

  const topics: Topic[] = [
    { name: "Sports", color: "#ff6b6b" },
    { name: "Wild Life", color: "#4ecdc4" },
    { name: "Music", color: "#7b68ee" },
    { name: "Videos", color: "#ff8e53" },
    { name: "Images", color: "#00ddeb" },
  ];

  const subscriptions: Subscription[] = [
    {
      channelName: "Nhlanhla's AI Sports Clips",
      creator: "NhlanhlaBhengu",
      type: "Video",
      preview: "A thrilling AI-generated extreme-sport montage",
      color: "#ff6b6b",
    },
    {
      channelName: "Sara's AI Music Vibes",
      creator: "SaraTunes",
      type: "Music",
      preview: "Chill beats crafted by AI",
      color: "#7b68ee",
    },
    {
      channelName: "WildLife Wonders",
      creator: "NatureLover",
      type: "Image",
      preview: "Stunning AI wildlife scenes",
      color: "#4ecdc4",
    },
  ];

  const dummyMedia: DummyMedia = {
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
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/1540394/1540394-hd_1920_1080_30fps.mp4",
        title: "Soccer Match Highlights",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/2855927/2855927-hd_1920_1080_30fps.mp4",
        title: "Basketball Dunk Compilation",
      },
      {
        type: "video",
        src: "https://videos.pexels.com/video-files/1721278/1721278-hd_1920_1080_30fps.mp4",
        title: "Rugby Action Moments",
      },
    ],
    Images: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        title: "Wildlife Image 1",
      },
      {
        type: "image",
        src: "https://pics.craiyon.com/2023-10-31/93234f8584254bf88c6d27430f35cba2.webp",
        title: "Wildlife Image 2",
      },
      {
        type: "image",
        src: "https://png.pngtree.com/thumb_back/fh260/background/20240506/pngtree-a-boat-on-a-lake-in-autumn-image_15669075.jpg",
        title: "Wildlife Image 3",
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

  const fallbackMedia = React.useMemo<{
    image: MediaItem[];
    video: MediaItem;
    audio: MediaItem;
  }>(() => ({
    image: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        title: "Fallback Wildlife Image 1",
      },
      {
        type: "image",
        src: "https://pics.craiyon.com/2023-10-31/93234f8584254bf88c6d27430f35cba2.webp",
        title: "Fallback Wildlife Image 2",
      },
    ],
    video: {
      type: "video",
      src: "https://youtu.be/Wz0jbPIWU30",
      title: "Fallback Nature Video",
    },
    audio: {
      type: "audio",
      src: "https://cdn.pixabay.com/audio/2023/10/25/audio_508e9b4631.mp3",
      title: "Fallback Instrumental Music",
    },
  }), []);

  const [subscribedChannels, setSubscribedChannels] = useState<Subscription[]>(subscriptions);
  const [selectedCategory, setSelectedCategory] = useState<keyof DummyMedia | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const storeGeneratedContent = useCallback(async (content: MediaItem): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found. Redirecting to login.");
      router.push("/login");
      return false;
    }

    try {
      const docId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "library", docId), {
        userId: user.uid,
        type: content.type,
        src: content.src,
        title: content.title,
        createdAt: serverTimestamp(),
      });
      console.log("Content stored in Firestore:", { docId, ...content });
      return true;
    } catch (error: unknown) {
      console.error("Error storing content in Firestore:", (error as Error).message);
      return false;
    }
  }, [router]);

  const getContentTypeFromPrompt = useCallback((prompt: string): "image" | "video" | "audio" => {
    const lowerPrompt = prompt.toLowerCase();
    if (
      lowerPrompt.includes("video") ||
      lowerPrompt.includes("movie") ||
      lowerPrompt.includes("clip")
    ) {
      return "video";
    } else if (
      lowerPrompt.includes("music") ||
      lowerPrompt.includes("song") ||
      lowerPrompt.includes("beat") ||
      lowerPrompt.includes("speak") ||
      lowerPrompt.includes("voice")
    ) {
      return "audio";
    }
    return "image";
  }, []);

  const handleGenerateClick = useCallback(async (prompt: string) => {
    console.log("handleGenerateClick called with prompt:", prompt);
    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent(null);

    const contentType = getContentTypeFromPrompt(prompt);
    const endpointMap = {
      image: [
        "https://<endpoint-id>.runpod.io/generate/image1",
        "https://<endpoint-id>.runpod.io/generate/image2",
      ],
      video: "https://<endpoint-id>.runpod.io/generate/video",
      audio: "https://<endpoint-id>.runpod.io/generate/audio",
    };

    if (contentType === "image") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      try {
        clearInterval(interval);
        setProgress(100);

        const content: GeneratedContent = {
          type: "image",
          items: [
            {
              src: fallbackMedia.image[0].src,
              title: `Generated Image 1: ${prompt}`,
              type: "image",
            },
            {
              src: fallbackMedia.image[1].src,
              title: `Generated Image 2: ${prompt}`,
              type: "image",
            },
          ],
        };

        setGeneratedContent(content);
        for (const item of content.items!) {
          const stored = await storeGeneratedContent(item);
          if (!stored) {
            console.warn("Failed to store content in Firestore.");
            return;
          }
        }
      } catch (error: unknown) {
        console.error("Generation error:", (error as Error).message);
        clearInterval(interval);
        setProgress(100);

        const content: GeneratedContent = {
          type: "image",
          items: [
            {
              src: fallbackMedia.image[0].src,
              title: `Fallback Image 1 for ${prompt}`,
              type: "image",
            },
            {
              src: fallbackMedia.image[1].src,
              title: `Fallback Image 2 for ${prompt}`,
              type: "image",
            },
          ],
        };
        setGeneratedContent(content);
        for (const item of content.items!) {
          const stored = await storeGeneratedContent(item);
          if (!stored) {
            console.warn("Failed to store fallback content in Firestore.");
            return;
          }
        }
      }
    } else {
      const endpointUrl = endpointMap[contentType] || endpointMap["image"][0];
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      try {
        const response = await fetch(endpointUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        clearInterval(interval);
        setProgress(100);

        let content: GeneratedContent;
        if (data.error) {
          throw new Error(data.error);
        } else if (contentType === "video" && data.video_base64) {
          content = {
            type: "video",
            src: `data:video/mp4;base64,${data.video_base64}`,
            title: prompt,
          };
        } else if (contentType === "audio" && data.audio_base64) {
          content = {
            type: "audio",
            src: `data:audio/wav;base64,${data.audio_base64}`,
            title: prompt,
          };
        } else {
          throw new Error("Unexpected response format");
        }

        setGeneratedContent(content);
        // Convert GeneratedContent to MediaItem for storage
        const mediaItem: MediaItem = {
          type: content.type,
          src: content.src || fallbackMedia[contentType].src, // Fallback if src is undefined
          title: content.title || `Generated ${contentType}`,
        };
        const stored = await storeGeneratedContent(mediaItem);
        if (!stored) {
          console.warn("Failed to store content in Firestore.");
          return;
        }
      } catch (error: unknown) {
        console.error("Generation error:", (error as Error).message);
        clearInterval(interval);
        setProgress(100);

        const fallback = fallbackMedia[contentType];
        const content: GeneratedContent = {
          type: contentType,
          src: fallback.src,
          title: `Fallback ${contentType} for ${prompt}`,
        };
        setGeneratedContent(content);
        const mediaItem: MediaItem = {
          type: content.type,
          src: content.src || fallback.src, // Fallback if src is undefined
          title: content.title || `Fallback ${contentType}`,
        };
        const stored = await storeGeneratedContent(mediaItem);
        if (!stored) {
          console.warn("Failed to store fallback content in Firestore.");
          return;
        }
      }
    }
  }, [fallbackMedia, storeGeneratedContent, getContentTypeFromPrompt]);

  useEffect(() => {
    if (onGenerateClick) {
      onGenerateClick.current = handleGenerateClick;
      console.log("handleGenerateClick assigned to onGenerateClick ref");
    }
  }, [onGenerateClick, handleGenerateClick]);

  const handleUnsubscribe = (channelName: string) => {
    setSubscribedChannels(
      subscribedChannels.filter((sub) => sub.channelName !== channelName)
    );
  };

  const handleTopicClick = (topicName: keyof DummyMedia) => {
    if (dummyMedia[topicName]) {
      setSelectedCategory(topicName);
    } else {
      setSelectedCategory(null);
    }
  };

  const closeMedia = () => {
    setSelectedCategory(null);
  };

  const closeGenerationModal = () => {
    setIsGenerating(false);
    setProgress(0);
    setGeneratedContent(null);
  };

  return (
    <div className={styles.mainContent}>
      {isGenerating && (
        <div className={styles.generationModal}>
          <div className={styles.generationBox}>
            <h3>Generating Your Content</h3>
            <div className={styles.progressBar}>
              <div className={`${styles.progressFill} ${styles.progressFillActive} ${styles[`progress${progress}`]}`}></div>
            </div>
            <p className={styles.progressText}>
              {progress < 100 ? `Generating... ${progress}%` : "Generation complete!"}
            </p>
            <div className={styles.generationPreview}>
              <div
                className={`${styles.blurOverlay} ${progress < 100 ? styles.blurOverlayActive : ''}`}
              ></div>
              {progress >= 100 && generatedContent && (
                generatedContent.type === "image" ? (
                  <div className={styles.imageContainer}>
                    {generatedContent.items?.map((item: MediaItem, index: number) => (
                      <div key={index} className={styles.imageWrapper}>
                        <Image
                          src={item.src}
                          alt={item.title}
                          className={styles.generationPreviewImage}
                          width={400}
                          height={300}
                          unoptimized
                        />
                        <p className={styles.imageTitle}>{item.title}</p>
                      </div>
                    ))}
                  </div>
                ) : generatedContent.type === "video" ? (
                  <video
                    src={generatedContent.src}
                    controls
                    className={styles.generationPreviewVideo}
                    title={generatedContent.title}
                  />
                ) : generatedContent.type === "audio" ? (
                  <audio
                    src={generatedContent.src}
                    controls
                    className={styles.generationPreviewAudio}
                    title={generatedContent.title}
                  />
                ) : (
                  <p>Unsupported content type</p>
                )
              )}
            </div>
            {progress >= 100 && (
              <div className={styles.generationActions}>
                {generatedContent?.type === "image" ? (
                  generatedContent.items?.map((item: MediaItem, index: number) => (
                    <a
                      key={index}
                      href={item.src}
                      download={`${item.title}.png`}
                      className={styles.downloadButton}
                    >
                      Download Image {index + 1}
                    </a>
                  ))
                ) : (
                  <a
                    href={generatedContent?.src}
                    download={`${generatedContent?.title}.${generatedContent?.type === "video" ? "mp4" : "wav"}`}
                    className={styles.downloadButton}
                  >
                    Download
                  </a>
                )}
                <button
                  className={styles.closeButton}
                  onClick={closeGenerationModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={`${styles.topicCard} ${styles[`topic${topic.name.replace(' ', '')}`]}`}
              onClick={() => handleTopicClick(topic.name as keyof DummyMedia)}
            >
              {topic.name}
            </div>
          ))}
        </div>
      </section>

      {selectedCategory && dummyMedia[selectedCategory] && (
        <section className={styles.mediaDisplay}>
          <h3>{selectedCategory}</h3>
          <div className={styles.mediaGrid}>
            {dummyMedia[selectedCategory].map((media: MediaItem, index: number) => (
              <div key={index} className={styles.mediaCard}>
                {media.type === "video" && (
                  <video
                    className={styles.mediaContent}
                    controls
                    src={media.src}
                    title={media.title}
                  />
                )}
                {media.type === "image" && (
                  <>
                    <Image
                      className={styles.mediaContent}
                      src={media.src}
                      alt={media.title}
                      title={media.title}
                      width={400}
                      height={300}
                      unoptimized
                    />
                    <a
                      href={media.src}
                      download={`${media.title}.jpg`}
                      className={styles.downloadButton}
                      title={`Download ${media.title}`}
                    >
                      Download
                    </a>
                  </>
                )}
                {media.type === "audio" && (
                  <audio
                    className={styles.mediaContent}
                    controls
                    src={media.src}
                    title={media.title}
                  />
                )}
                <p className={styles.mediaTitle}>{media.title}</p>
              </div>
            ))}
          </div>
          <button className={styles.closeButton} onClick={closeMedia}>
            Close
          </button>
        </section>
      )}

      <section className={styles.yourSubscriptions}>
        <h2>Your Subscriptions</h2>
        {subscribedChannels.length > 0 ? (
          <div className={styles.subscriptionsGrid}>
            {subscribedChannels.map((sub) => (
              <div
                key={sub.channelName}
                className={`${styles.subscriptionCard} ${styles[`subscription${sub.channelName.replace(/[^a-zA-Z0-9]/g, '')}`]}`}
              >
                <div className={styles.channelInfo}>
                  <h3>{sub.channelName}</h3>
                  <p className={styles.creator}>by {sub.creator}</p>
                  <p className={styles.preview}>{sub.preview}</p>
                </div>
                <button
                  className={styles.unsubscribeButton}
                  onClick={() => handleUnsubscribe(sub.channelName)}
                >
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noSubscriptions}>
            You haven&apos;t subscribed to any channels yet. Explore topics to find creators!
          </p>
        )}
      </section>
    </div>
  );
}