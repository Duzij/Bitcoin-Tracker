import { NewsItem } from "./types.ts";

export async function fetchNews(
  timestamp: string,
  percentChange: number,
  priceId: number,
  existingTitles: string[],
): Promise<NewsItem[]> {
  try {
    const requiredNewsCount = percentChange > 6 ? 3 : 1;
    const fetchedNews: NewsItem[] = [];
    let pageSize = 1;

    while (fetchedNews.length < requiredNewsCount) {
      const newArticles = await fetchNewsFromAPI(
        timestamp,
        pageSize,
        existingTitles,
        priceId
      );

      // Add only unique articles to the fetchedNews list
      newArticles.forEach((article) => {
        if (!fetchedNews.some((news) => news.title === article.title)) {
          fetchedNews.push(article);
        }
      });

      pageSize += 2; // Increase pageSize for the next attempt
    }

    return fetchedNews.slice(0, requiredNewsCount); // Return only the required number of news
  } catch (error) {
    console.error(`Error fetching news for ${timestamp}:`, error);
    return [];
  }
}

async function fetchNewsFromAPI(
  timestamp: string,
  pageSize: number,
  existingTitles: string[],
  priceId: number,
): Promise<NewsItem[]> {
  const date = timestamp.split("T")[0];

  const dateMinusOneDay = new Date(
    new Date(date).getTime() - 24 * 60 * 60 * 1000,
  ).toISOString().split("T")[0];

  console.log(`Fetching news with pageSize: ${pageSize}`);
  const params = new URLSearchParams({
    q: "bitcoin",
    from: dateMinusOneDay,
    to: date,
    sortBy: "popularity",
    apiKey: Deno.env.get("NEWS_API_KEY") ?? "",
    language: "en",
    pageSize: pageSize.toString(),
  });

  const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Fetched news data:", data);

  const filteredArticles = data.articles.filter(
    (article: any) => !existingTitles.includes(article.title),
  );

  return filteredArticles.map((article: any) => {
    const trimmedContent = article.content
      ? article.content.replace(/\s\[\+\d+\schars\]$/, "")
      : null;

    return {
      title: article.title,
      price_id: priceId, // Placeholder, will be set in the main function
      content: trimmedContent,
      description: article.description,
      source: article.source.name,
      url: article.url,
      timestamp: article.publishedAt,
      sentiment: determineSentiment(
        article.title,
        article.description + trimmedContent,
      ),
    };
  });
}

export function determineSentiment(
  title: string,
  description: string,
): "positive" | "neutral" | "negative" {
  const text = (title + " " + description).toLowerCase();

  const positiveWords = [
    "up",
    "rise",
    "rising",
    "gain",
    "bull",
    "bullish",
    "growth",
    "increase",
    "soar",
    "surge",
    "good",
    "positive",
    "rally",
  ];
  const negativeWords = [
    "down",
    "fall",
    "falling",
    "drop",
    "bear",
    "bearish",
    "crash",
    "decline",
    "decrease",
    "bad",
    "negative",
    "dump",
    "plunge",
  ];

  let positiveScore = 0;
  let negativeScore = 0;

  positiveWords.forEach((word) => {
    if (text.includes(word)) positiveScore++;
  });

  negativeWords.forEach((word) => {
    if (text.includes(word)) negativeScore++;
  });

  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}