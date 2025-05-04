// types.ts
export interface NewsItem {
  price_id: number;
  title: string;
  content: string;
  description: string;
  source: string;
  url: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface BitcoinPrice {
  price: number;
  percent_change: number;
  timestamp: string;
}

export interface TopHeadlinersResponse {
  status: string;
  totalResults: number;
  articles: HeadlinerResponse[];
}

export interface HeadlinerResponse {
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
