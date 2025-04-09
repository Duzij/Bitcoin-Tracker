// types.ts
export interface NewsItem {
    title: string;
    summary: string;
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
