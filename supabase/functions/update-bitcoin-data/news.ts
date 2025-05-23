import { determineSentiment } from "./helpers.ts";
import { HeadlinerResponse, NewsItem, TopHeadlinersResponse } from "./types.ts";

export async function fetchNews(
  percentChange: number,
  priceId: number,
  existingTitles: string[],
  lastPostedDate: Date,
): Promise<NewsItem[]> {
  try {
    const requiredNewsCount = getRequiredNumberOfArticles(
      percentChange,
      lastPostedDate,
    );
    const fetchedNews: NewsItem[] = [];
    let pageSize = 1;

    console.log(
      `Fetching ${requiredNewsCount} news for percent change: ${percentChange}`,
    );

    while (fetchedNews.length < requiredNewsCount) {
      const newArticles = await fetchNewsFromAPI(
        pageSize,
        existingTitles,
        priceId,
      );

      console.log(`Fetched ${newArticles.length} new articles`);

      // Add only unique articles to the fetchedNews list
      newArticles.forEach((article) => {
        if (!fetchedNews.some((news) => news.title === article.title)) {
          fetchedNews.push(article);
          console.log(
            `Added new article: ${article.title} - ${article.timestamp}`
          );
        }
      });

      pageSize += 2; // Increase pageSize for the next attempt
    }

    return fetchedNews.slice(0, requiredNewsCount); // Return only the required number of news
  } catch (error) {
    console.error(`Error fetching news`, error);
    return [];
  }
}

// If the last posted date is more than 2 days are, we need to fetch 1
function getRequiredNumberOfArticles(
  percentChange: number,
  lastPostedDate: Date,
): number {
  const isLastPostedTwoDaysAgo =
    lastPostedDate.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000;
  return Math.abs(percentChange) > 5 ? 5 : isLastPostedTwoDaysAgo ? 3 : 0;
}

async function fetchNewsFromAPI(
  pageSize: number,
  existingTitles: string[],
  priceId: number,
): Promise<NewsItem[]> {
  console.log(`Fetching news with pageSize: ${pageSize}`);
  const params = new URLSearchParams({
    apiKey: Deno.env.get("NEWS_API_KEY") ?? "",
    pageSize: pageSize.toString(),
    country: "us",
  });

  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?${params}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  const data = await response.json() as TopHeadlinersResponse;
  console.log(`Fetched ${data.articles.length} news data from https://newsapi.org/v2/top-headlines?${params}`);

  const filteredArticles = data.articles.filter(
    (article: HeadlinerResponse) => !existingTitles.includes(article.title),
  );

  return filteredArticles.map((article: HeadlinerResponse): NewsItem => {
    const trimmedContent = article.content
      ? article.content.replace(/\s\[\+\d+\schars\]$/, "")
      : "";

    return {
      title: article.title,
      price_id: priceId,
      content: trimmedContent,
      description: article.description,
      source: article.source.name,
      url: article.url,
      timestamp: article.publishedAt,
      sentiment: determineSentiment(
        article.title,
        article.description + (trimmedContent || ""),
      ),
    };
  });
}
