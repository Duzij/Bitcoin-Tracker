export  interface BitcoinPrice {
  id: number;
  price: number;
  timestamp: string;
  percent_change: number;
  has_news?: boolean;
  news?: NewsEvent[];
}

export interface NewsEvent {
  id: number;
  title: string;
  content: string;
  description: string;
  source: string;
  url: string;
  timestamp: string;
  price_id: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'none';
  type: number; // 0 for global news, 1 for crypto news
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}
 