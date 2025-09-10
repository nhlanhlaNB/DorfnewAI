"use client";

import styles from "../styles/MainContent.module.css";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

interface Topic {
  name: string;
  color: string;
}

interface DummyMedia {
  Videos: MediaItem[];
  Images: MediaItem[];
  Music: MediaItem[];
}

interface Insight {
  title: string;
  shortDescription: string;
  fullDescription: string;
}

interface MainContentProps {
  onGenerateClick: React.MutableRefObject<((value: string) => void) | null>;
}

export default function MainContent({ onGenerateClick }: MainContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof DummyMedia | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const topics: Topic[] = [
    { name: "Sports", color: "#ff6b6b" },
    { name: "Wild Life", color: "#4ecdc4" },
    { name: "Music", color: "#7b68ee" },
    { name: "Videos", color: "#ff8e53" },
    { name: "Images", color: "#00ddeb" },
  ];

  const insights: Insight[] = [
    {
      title: "Text-to-Image Generation",
      shortDescription: "AI creates images from text prompts using models like Stable Diffusion.",
      fullDescription:
        "Text-to-image generation uses deep learning models, such as Stable Diffusion or DALL·E, to convert text prompts into visual images. These models are trained on vast datasets of image-text pairs, learning to map textual descriptions to visual features. The process involves a diffusion model that iteratively refines random noise into a coherent image based on the input prompt.",
    },
    {
      title: "Text-to-Video Generation",
      shortDescription: "AI generates dynamic videos from text descriptions.",
      fullDescription:
        "Text-to-video generation extends text-to-image concepts to create short video clips. Models like Runway or Sora use temporal coherence to ensure smooth frame transitions. They are trained on video datasets to understand motion and context, generating videos from prompts like 'a futuristic city at night.' This technology is advancing rapidly for creative and commercial use.",
    },
    {
      title: "AI Model Training",
      shortDescription: "How AI models learn from data to generate content.",
      fullDescription:
        "AI models are trained using large datasets and techniques like supervised learning or reinforcement learning. For generation tasks, models like GANs or transformers are fed millions of examples (e.g., images, videos) to learn patterns. Training involves optimizing parameters to minimize errors, often requiring significant computational power on GPUs or TPUs.",
    },
  ];

   const dummyMedia: DummyMedia = {
    Videos: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        title: "Space Stars Image",
      },
      {
        type: "video",
        src: "https://videocdn.cdnpk.net/videos/015faed0-10ac-52ef-bd51-c6e06feec41e/horizontal/previews/clear/large.mp4?token=exp=1757545891~hmac=bb5bf20b4c16fec8a822d1ea24fc6c8b90ce7745496fc344bf2e8545a9ac02ce",
        title: "Space Scenic Video",
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
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        title: "Fallback Space Image",
      },
      {
        type: "image",
        src: "https://pics.craiyon.com/2023-10-31/93234f8584254bf88c6d27430f35cba2.webp",
        title: "Fallback Wildlife Image",
      },
    ],
    video: {
      type: "video",
      src: "https://videocdn.cdnpk.net/videos/015faed0-10ac-52ef-bd51-c6e06feec41e/horizontal/previews/clear/large.mp4?token=exp=1757545891~hmac=bb5bf20b4c16fec8a822d1ea24fc6c8b90ce7745496fc344bf2e8545a9ac02ce",
      title: "Fallback Space Scenic Video",
    },
    audio: {
      type: "audio",
      src: "https://cdn.pixabay.com/audio/2023/10/25/audio_508e9b4631.mp3",
      title: "Fallback Instrumental Music",
    },
  }), []);

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
        category: content.type === "image" ? "Images" : content.type === "video" ? "Videos" : "Music",
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
        const mediaItem: MediaItem = {
          type: content.type,
          src: content.src || fallbackMedia[contentType].src,
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
          src: content.src || fallback.src,
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

  const handleGenerateSimilar = (prompt: string) => {
    if (onGenerateClick.current) {
      onGenerateClick.current(prompt);
    }
  };

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight);
  };

  const closeInsightModal = () => {
    setSelectedInsight(null);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      {isGenerating && (
        <div className={styles.generationModal}>
          <div className={styles.generationBox} role="dialog" aria-labelledby="generation-title">
            <h3 id="generation-title">Generating Your Content</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
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
                    aria-label={generatedContent.title}
                  />
                ) : generatedContent.type === "audio" ? (
                  <audio
                    src={generatedContent.src}
                    controls
                    className={styles.generationPreviewAudio}
                    title={generatedContent.title}
                    aria-label={generatedContent.title}
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
                      aria-label={`Download ${item.title}`}
                    >
                      Download Image {index + 1}
                    </a>
                  ))
                ) : (
                  <a
                    href={generatedContent?.src}
                    download={`${generatedContent?.title}.${generatedContent?.type === "video" ? "mp4" : "wav"}`}
                    className={styles.downloadButton}
                    aria-label={`Download ${generatedContent?.title}`}
                  >
                    Download
                  </a>
                )}
                <button
                  className={styles.closeButton}
                  onClick={closeGenerationModal}
                  aria-label="Close generation modal"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedInsight && (
        <div className={styles.insightModal}>
          <div className={styles.insightBox} role="dialog" aria-labelledby="insight-title">
            <h3 id="insight-title">{selectedInsight.title}</h3>
            <p className={styles.insightFullDescription}>{selectedInsight.fullDescription}</p>
            <button
              className={styles.closeButton}
              onClick={closeInsightModal}
              aria-label="Close insight modal"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={styles.hero}>
        <video
          className={styles.heroVideo}
          src="https://videocdn.cdnpk.net/videos/015faed0-10ac-52ef-bd51-c6e06feec41e/horizontal/previews/clear/large.mp4?token=exp=1757545891~hmac=bb5bf20b4c16fec8a822d1ea24fc6c8b90ce7745496fc344bf2e8545a9ac02ce"
          title="Sample Video"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Video Background"
        />
        <div className={styles.heroOverlay}>
          <h1>Welcome to Dorfnew</h1>
          <p>Discover and Generate Amazing AI Content</p>
          <button className={styles.heroButton} onClick={() => handleGenerateSimilar("Generate an awesome AI video")}>
            Start Generating Now
          </button>
        </div>
      </div>

      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={`${styles.topicCard} ${styles[`topic${topic.name.replace(' ', '')}`]}`}
              onClick={() => handleTopicClick(topic.name as keyof DummyMedia)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTopicClick(topic.name as keyof DummyMedia)}
              aria-label={`Explore ${topic.name}`}
              style={{ background: topic.color }}
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
                    aria-label={media.title}
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
                      aria-label={`Download ${media.title}`}
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
                    aria-label={media.title}
                  />
                )}
                <p className={styles.mediaTitle}>{media.title}</p>
              </div>
            ))}
          </div>
          <button
            className={styles.closeButton}
            onClick={closeMedia}
            aria-label="Close media section"
          >
            Close
          </button>
        </section>
      )}

      <section className={styles.aiInsights}>
        <h2>Learn About AI Generation</h2>
        <div className={styles.insightGrid}>
          {insights.map((insight, index) => (
            <div key={index} className={styles.insightCard}>
              <h3 className={styles.insightTitle}>{insight.title}</h3>
              <p className={styles.insightDescription}>{insight.shortDescription}</p>
              <button
                className={styles.insightButton}
                onClick={() => handleInsightClick(insight)}
                aria-label={`Learn more about ${insight.title}`}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
        <button
          className={styles.insightButton}
          onClick={() => handleGenerateSimilar("Generate an AI-created image")}
          aria-label="Try AI generation"
        >
          Try AI Generation
        </button>
      </section>
    </div>
  );
}
