import { BitcoinPrice, DateRange, NewsEvent } from "../types";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY_ANON_PUBLIC;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export const fetchNewsForPrice = async (
  priceId: number,
): Promise<NewsEvent[]> => {
  try {
    // Query news events related to a specific price ID
    const { data: news, error } = await supabaseClient
      .from("news_events")
      .select("*")
      .eq("price_id", priceId);

    if (error) {
      throw new Error(
        `Error fetching news for price ID ${priceId}: ${error.message}`,
      );
    }

    return news || [];
  } catch (error) {
    console.error("Error fetching news for price:", error);
    throw new Error("Failed to fetch news for price");
  }
};

export const fetchBitcoinPrices = async (
  dateRange: DateRange,
): Promise<BitcoinPrice[]> => {
  const { start, end } = dateRange;

  try {
    // Fetch Bitcoin prices
    let query = supabaseClient
      .from("bitcoin_prices")
      .select("id, price, timestamp, percent_change");

    if (start) {
      query = query.gte("timestamp", start.toISOString());
    }
    if (end) {
      query = query.lte("timestamp", end.toISOString());
    }
    query = query.order("timestamp", { ascending: true });

    const { data: prices, error } = await query;

    if (error) {
      throw new Error(`Error fetching Bitcoin prices: ${error.message}`);
    }

    // Fetch related news events
    const priceIds = prices.map((price) => price.id);
    const { data: news, error: newsError } = await supabaseClient
      .from("news_events")
      .select("*")
      .in("price_id", priceIds);

    if (newsError) {
      throw new Error(`Error fetching news events: ${newsError.message}`);
    }

    // Map news events to corresponding price points
    const result = prices.map((price) => {
      const relatedNews = news.filter((n) => n.price_id === price.id);
      return {
        ...price,
        news: relatedNews.length > 0 ? relatedNews : undefined,
        has_news: relatedNews.length > 0,
        isSignificant: Math.abs(price.percent_change) >= 10,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error);
    throw new Error("Failed to fetch Bitcoin data");
  }
};
