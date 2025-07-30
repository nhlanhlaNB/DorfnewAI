"use client";
import styles from "../styles/MainContent.module.css";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function MainContent({ onGenerateClick }) {
  const router = useRouter();
  const generateHandlerRef = useRef(null);

  const topics = [
    { name: "Sports", color: "#ff6b6b" },
    { name: "Wild Life", color: "#4ecdc4" },
    { name: "Music", color: "#7b68ee" },
    { name: "Videos", color: "#ff8e53" },
    { name: "Images", color: "#00ddeb" },
  ];

  const subscriptions = [
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

  const [dummyMedia, setDummyMedia] = useState({
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
  });

  const fallbackMedia = {
    image: {
      type: "image",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      title: "Fallback Tiger Image",
    },
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
  };

  const [subscribedChannels, setSubscribedChannels] = useState(subscriptions);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [sportsNews, setSportsNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (onGenerateClick) {
      onGenerateClick.current = handleGenerateClick;
      console.log("handleGenerateClick assigned to onGenerateClick ref");
    }

    // Fetch sports news
    const fetchSportsNews = async () => {
      try {
        // Fetch global sports news with emphasis on South Africa and Nigeria
        const globalResponse = await fetch(
          `https://newsapi.org/v2/everything?q=sports+South Africa+Nigeria&language=en&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`
        );
        if (!globalResponse.ok) throw new Error(`Global fetch failed: ${globalResponse.statusText}`);
        const globalData = await globalResponse.json();
        let articles = globalData.status === "ok" ? globalData.articles : [];

        // Fetch country-specific news for South Africa
        const zaResponse = await fetch(
          `https://newsapi.org/v2/top-headlines?country=za&category=sports&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`
        );
        if (!zaResponse.ok) throw new Error(`South Africa fetch failed: ${zaResponse.statusText}`);
        const zaData = await zaResponse.json();
        if (zaData.status === "ok") articles = [...articles, ...zaData.articles];

        // Fetch country-specific news for Nigeria
        const ngResponse = await fetch(
          `https://newsapi.org/v2/top-headlines?country=ng&category=sports&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`
        );
        if (!ngResponse.ok) throw new Error(`Nigeria fetch failed: ${ngResponse.statusText}`);
        const ngData = await ngResponse.json();
        if (ngData.status === "ok") articles = [...articles, ...ngData.articles];

        // Deduplicate articles by URL
        const uniqueArticles = Array.from(
          new Map(articles.map((article) => [article.url, article])).values()
        );

        // Filter out articles with null or empty titles and limit to 6
        const validArticles = uniqueArticles
          .filter((article) => article.title && article.title !== "[Removed]")
          .slice(0, 30);

        setSportsNews(validArticles);
      } catch (error) {
        console.error("Error fetching sports news:", error.message);
        setSportsNews([]);
      }
    };

    fetchSportsNews();
  }, [onGenerateClick]);

  const handleUnsubscribe = (channelName) => {
    setSubscribedChannels(
      subscribedChannels.filter((sub) => sub.channelName !== channelName)
    );
  };

  const handleTopicClick = (topicName) => {
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

  const closeArticleModal = () => {
    setSelectedArticle(null);
  };

  const storeGeneratedContent = async (content) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found. Redirecting to login.");
      router.push("/login");
      return false;
    }

    try {
      const docId = `${user.uid}_${Date.now()}`; // Unique ID for the document
      await setDoc(doc(db, "library", docId), {
        userId: user.uid,
        type: content.type,
        src: content.src,
        title: content.title,
        createdAt: serverTimestamp(),
      });
      console.log("Content stored in Firestore:", { docId, ...content });
      return true;
    } catch (error) {
      console.error("Error storing content in Firestore:", error);
      return false;
    }
  };

  const getContentTypeFromPrompt = (prompt) => {
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
  };

  const handleGenerateClick = async (prompt) => {
    console.log("handleGenerateClick called with prompt:", prompt);
    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent(null);

    const contentType = getContentTypeFromPrompt(prompt);
    const endpointMap = {
      image: "https://<endpoint-id>.runpod.io/generate/image1",
      video: "https://<endpoint-id>.runpod.io/generate/video",
      audio: "https://<endpoint-id>.runpod.io/generate/audio",
    };
    const endpointUrl = endpointMap[contentType] || endpointMap["image"]; // Default to image if unsupported

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

      let content;
      if (data.error) {
        throw new Error(data.error);
      } else if (contentType === "image" && data.image_base64) {
        content = {
          type: "image",
          src: `data:image/png;base64,${data.image_base64}`,
          title: prompt,
        };
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
      const stored = await storeGeneratedContent(content);
      if (!stored) {
        console.warn("Failed to store content in Firestore. Showing in modal but not closing.");
        return;
      }
    } catch (error) {
      console.error("Generation error:", error);
      clearInterval(interval);
      setProgress(100);

      const fallback = fallbackMedia[contentType] || fallbackMedia.image;
      const content = {
        ...fallback,
        title: `Fallback ${contentType} for ${prompt}`,
      };
      setGeneratedContent(content);
      const stored = await storeGeneratedContent(content);
      if (!stored) {
        console.warn("Failed to store fallback content in Firestore. Showing in modal but not closing.");
        return;
      }
    }
  };

  return (
    <div className={styles.mainContent}>
      {isGenerating && (
        <div className={styles.generationModal}>
          <div className={styles.generationBox}>
            <h3>Generating Your Content</h3>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className={styles.progressText}>
              {progress < 100 ? `Generating... ${progress}%` : "Generation complete!"}
            </p>
            <div className={styles.generationPreview}>
              <div
                className={styles.blurOverlay}
                style={{
                  opacity: progress < 100 ? 0.8 : 0,
                  backdropFilter: progress < 100 ? "blur(15px)" : "none",
                }}
              ></div>
              {progress >= 100 && generatedContent && (
                generatedContent.type === "image" ? (
                  <img
                    src={generatedContent.src}
                    alt={generatedContent.title}
                    className={styles.generationPreviewImage}
                  />
                ) : generatedContent.type === "video" ? (
                  <video
                    src={generatedContent.src}
                    controls
                    className={styles.generationPreviewVideo}
                  />
                ) : generatedContent.type === "audio" ? (
                  <audio
                    src={generatedContent.src}
                    controls
                    className={styles.generationPreviewAudio}
                  />
                ) : (
                  <p>Unsupported content type</p>
                )
              )}
            </div>
            {progress >= 100 && (
              <div className={styles.generationActions}>
                <a
                  href={generatedContent?.src}
                  download={`${generatedContent?.title}.${generatedContent.type === "image" ? "png" : generatedContent.type === "video" ? "mp4" : "wav"}`}
                  className={styles.downloadButton}
                >
                  Download
                </a>
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

      {selectedArticle && (
        <div className={styles.articleModal}>
          <div className={styles.articleBox}>
            <h3>{selectedArticle.title}</h3>
            {selectedArticle.urlToImage && (
              <img
                src={selectedArticle.urlToImage}
                alt={selectedArticle.title}
                className={styles.articleImage}
              />
            )}
            <p className={styles.articleSource}>
              Source: {selectedArticle.source.name}
            </p>
            <p className={styles.articlePublished}>
              Published: {new Date(selectedArticle.publishedAt).toLocaleString()}
            </p>
            <p className={styles.articleDescription}>
              {selectedArticle.description || "No description available."}
            </p>
            <p className={styles.articleContent}>
              {selectedArticle.content || "No additional content available."}
            </p>
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readMoreButton}
            >
              Read Full Article
            </a>
            <button
              className={styles.closeButton}
              onClick={closeArticleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section className={styles.exploreTopics}>
        <h2>Explore Topics</h2>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <div
              key={topic.name}
              className={styles.topicCard}
              style={{ backgroundColor: topic.color }}
              onClick={() => handleTopicClick(topic.name)}
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
            {dummyMedia[selectedCategory].map((media, index) => (
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
                    <img
                      className={styles.mediaContent}
                      src={media.src}
                      alt={media.title}
                      title={media.title}
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

      <section className={styles.sportsNews}>
        <h2>Sports News</h2>
        {sportsNews.length > 0 ? (
          <div className={styles.newsGrid}>
            {sportsNews.map((article, index) => (
              <div
                key={index}
                className={styles.newsCard}
                onClick={() => setSelectedArticle(article)}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className={styles.newsImage}
                  />
                )}
                <p className={styles.newsTitle}>{article.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noNews}>No sports news available.</p>
        )}
      </section>

      <section className={styles.yourSubscriptions}>
        <h2>Your Subscriptions</h2>
        {subscribedChannels.length > 0 ? (
          <div className={styles.subscriptionsGrid}>
            {subscribedChannels.map((sub) => (
              <div
                key={sub.channelName}
                className={styles.subscriptionCard}
                style={{ borderLeft: `4px solid ${sub.color}` }}
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
            You haven't subscribed to any channels yet. Explore topics to find creators!
          </p>
        )}
      </section>
    </div>
  );
}