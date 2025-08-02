const functions = require("firebase-functions");
const axios = require("axios");

exports.fetchSportsNews = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category: "sports",
        country: "us", // Adjust country as needed (e.g., "gb" for UK)
        apiKey: "a98e6ec9f1414475966f5c25a2ce28df", // Replace with your NewsAPI key
        pageSize: 16, // Limit to 10 articles
      },
    });

    const articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description || "No description available",
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));

    res.status(200).json({ status: "success", articles });
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ status: "error", message: "Failed to fetch news" });
  }
});