// types.ts
export interface NewsItem {
  price_id: number;
  title: string;
  content: string;
  description: string;
  source: string;
  url: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative" | "none";
  type: number; // 0 for global news, 1 for crypto news
}

export interface BitcoinPrice {
  price: number;
  percent_change: number;
  timestamp: string;
}

export interface NewsEndpointResponse {
  status: string;
  totalResults: number;
  articles: ArticleResponse[];
}

export interface ArticleResponse {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}
