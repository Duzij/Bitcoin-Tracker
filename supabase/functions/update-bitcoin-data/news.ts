import { determineSentiment } from "./helpers.ts";
import { ArticleResponse, NewsEndpointResponse, NewsItem } from "./types.ts";

// If the last posted date is more than 2 days are, we need to fetch 1
function getRequiredNumberOfArticles(
  percentChange: number,
  lastPostedDate: Date,
): number {
  const isLastPostedTwoDaysAgo =
    lastPostedDate.getTime() < Date.now() - 2 * 24 * 60 * 60 * 1000;
  return Math.abs(percentChange) > 4 ? 5 : isLastPostedTwoDaysAgo ? 3 : 0;
}

enum NewsType {
  Global = 0,
  Crypto = 1,
}

abstract class NewsFetcher {
  abstract type: NewsType;
  abstract url: string;
  abstract params: URLSearchParams;

  public async fetchNews(
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
      while (fetchedNews.length < requiredNewsCount) {
        const newArticles = await this.fetchNewsFromAPI(
          pageSize,
          existingTitles,
          priceId,
        );

        newArticles.forEach((article) => {
          if (!fetchedNews.some((news) => news.title === article.title)) {
            fetchedNews.push(article);
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

  private async fetchNewsFromAPI(
    pageSize: number,
    existingTitles: string[],
    priceId: number,
  ): Promise<NewsItem[]> {
    this.params.set("pageSize", pageSize.toString());
    const response = await fetch(`${this.url}?${this.params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json() as NewsEndpointResponse;
    if (!data.articles || data.articles.length === 0) {
      console.warn("No articles found in the response");
      return [];
    }
    if (data.status !== "ok") {
      throw new Error(`API returned an error: ${data}`);
    }
    const filteredArticles = data.articles.filter(
      (article: ArticleResponse) => !existingTitles.includes(article.title),
    );

    return filteredArticles.map((article: ArticleResponse): NewsItem => {
      const trimmedContent = article.content
        ? article.content.replace(/\s\[\+\d+\schars\]$/, "")
        : "";

      return {
        title: article.title,
        price_id: priceId,
        content: trimmedContent,
        description: article.description || "",
        source: article.source.name,
        url: article.url,
        timestamp: article.publishedAt,
        sentiment: determineSentiment(article.title),
        type: this.type,
      };
    });
  }
}

export class CryptoNewsFetcher extends NewsFetcher {
  url = "https://newsapi.org/v2/everything";
  params = new URLSearchParams({
    q: "bitcoin",
    from:
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
    sortBy: "popularity",
    apiKey: Deno.env.get("NEWS_API_KEY") ?? "",
    language: "en"
  });
  type = NewsType.Crypto;
}

export class GlobalNewsFetcher extends NewsFetcher {
  url = "https://newsapi.org/v2/top-headlines";
  params = new URLSearchParams({
    apiKey: Deno.env.get("NEWS_API_KEY") ?? "",
    pageSize: "1",
    language: "en"
  });
  type = NewsType.Global;
}
