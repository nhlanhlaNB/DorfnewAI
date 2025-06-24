"use client";
import styles from "../styles/MainContent.module.css";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';

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

  // Mock subscription data
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

  // Dummy media data (3 items per category)
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

  // Hardcoded fallback media for API failure
  const fallbackMedia = {
    image: {
      type: "image",
      src: "https://png.pngtree.com/thumb_back/fh260/background/20230703/pngtree-3d-rendering-of-drone-soaring-above-ocean-image_3788567.jpg",
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
    }
  };

  const [subscribedChannels, setSubscribedChannels] = useState(subscriptions);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState(null);

  // Expose handleGenerateClick to Header via ref
  useEffect(() => {
    if (onGenerateClick) {
      onGenerateClick.current = handleGenerateClick;
      console.log("handleGenerateClick assigned to onGenerateClick ref"); // Debugging
    }
  }, [onGenerateClick]);

  const handleUnsubscribe = (channelName) => {
    setSubscribedChannels(subscribedChannels.filter((sub) => sub.channelName !== channelName));
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

const storeGeneratedContent = (content) => {
  const category = content.type === "image" ? "Images" : 
                  content.type === "video" ? "Videos" : "Audio";
  
  // Update local state
  setDummyMedia((prev) => ({
    ...prev,
    [category]: [...prev[category], content],
  }));
  
  // Save to localStorage for the library
  const libraryContent = JSON.parse(localStorage.getItem('dorfnewLibrary')) || {
    Images: [],
    Videos: [],
    Audio: []
  };
  
  libraryContent[category].push(content);
  localStorage.setItem('dorfnewLibrary', JSON.stringify(libraryContent));
  
  // If you're using Supabase, you would also save to the database here
};

  const getContentTypeFromPrompt = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('video') || lowerPrompt.includes('movie') || lowerPrompt.includes('clip')) {
      return 'video';
    } else if (lowerPrompt.includes('music') || lowerPrompt.includes('song') || lowerPrompt.includes('beat')) {
      return 'audio';
    } else if (lowerPrompt.includes('speak') || lowerPrompt.includes('voice')) {
      return 'audio';
    }
    return 'image'; // Default to image
  };

  const handleGenerateClick = async (prompt) => {
    console.log("handleGenerateClick called with prompt:", prompt);
    setIsGenerating(true);
    setProgress(0);
    setGeneratedContent(null);

    // Determine content type based on prompt
    const contentType = getContentTypeFromPrompt(prompt);
    
    // Simulate progress
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
      // Determine API URL based on content type
      let apiUrl;
      switch(contentType) {
        case 'video':
          apiUrl = process.env.NEXT_PUBLIC_OPENSORA_API_URL;
          break;
        case 'audio':
          apiUrl = process.env.NEXT_PUBLIC_AUDIOLDM_API_URL;
          break;
        default:
          apiUrl = process.env.NEXT_PUBLIC_SD35_API_URL;
      }

      console.log("Calling API:", apiUrl, "with prompt:", prompt);
      
      // Make API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration: contentType === 'audio' ? 30.0 : 5.0 }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (data.status === 'success') {
        const content = {
          type: data.type || contentType,
          src: `data:${contentType === 'image' ? 'image/png' : contentType === 'video' ? 'video/mp4' : 'audio/mpeg'};base64,${data.output}`,
          title: prompt,
        };
        setGeneratedContent(content);
        storeGeneratedContent(content);
      } else {
        throw new Error('Generation failed');
      }
    } catch (error) {
      console.error("Generation error:", error);
      clearInterval(interval);
      setProgress(100);
      
      // Use fallback media based on determined content type
      const fallback = fallbackMedia[contentType] || fallbackMedia.image;
      const content = { 
        ...fallback, 
        title: `Fallback ${contentType === 'image' ? 'Image' : contentType === 'video' ? 'Video' : 'Audio'}` 
      };
      setGeneratedContent(content);
      storeGeneratedContent(content);
    }
  };

  return (
    <div className={styles.mainContent}>
      {/* Generate Modal */}
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
              <div className={styles.blurOverlay} style={{ 
                opacity: progress < 100 ? 0.8 : 0,
                backdropFilter: progress < 100 ? 'blur(15px)' : 'none'
              }}></div>
              {progress >= 100 && generatedContent && (
                generatedContent.type === "video" ? (
                  <video
                    className={styles.generationPreviewImage}
                    controls
                    src={generatedContent.src}
                    title={generatedContent.title}
                    autoPlay
                  />
                ) : generatedContent.type === "image" ? (
                  <img
                    src={generatedContent.src}
                    alt={generatedContent.title}
                    className={styles.generationPreviewImage}
                  />
                ) : (
                  <audio
                    className={styles.generationPreviewImage}
                    controls
                    src={generatedContent.src}
                    title={generatedContent.title}
                    autoPlay
                  />
                )
              )}
            </div>
            {progress >= 100 && (
              <div className={styles.generationActions}>
                <a
                  href={generatedContent.src}
                  download={`${generatedContent.title}.${generatedContent.type === 'image' ? 'png' : generatedContent.type === 'video' ? 'mp4' : 'mp3'}`}
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

      {/* Explore Topics Section */}
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

      {/* Media Display Section */}
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

      {/* Your Subscriptions Section */}
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