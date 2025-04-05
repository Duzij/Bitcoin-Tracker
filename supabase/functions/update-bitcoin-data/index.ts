import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Fetch latest Bitcoin price from an API
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
    );
    const data = await response.json();

    if (!data.bitcoin) {
      throw new Error("Failed to fetch Bitcoin data");
    }

    const price = data.bitcoin.usd;
    const percentChange = data.bitcoin.usd_24h_change;
    const timestamp = new Date().toISOString();

    // Insert new price record
    const { data: insertedPrice, error: insertError } = await supabaseClient
      .from("bitcoin_prices")
      .insert([
        { price, percent_change: percentChange, timestamp },
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    // If percent change is significant (e.g., more than 5%), fetch relevant news
    if (Math.abs(percentChange) > 5) {
      const priceId = insertedPrice[0].id;

      // Fetch news from a crypto news API (example)
      const newsResponse = await fetch(
        "https://cryptonews-api.com/api/v1/category?section=general&items=3&token=YOUR_API_KEY",
      );
      const newsData = await newsResponse.json();

      if (newsData.data && newsData.data.length > 0) {
        interface NewsItem {
          title: string;
          description: string;
          source_name: string;
          news_url: string;
          date: string;
        }

        const newsItems = newsData.data.map((item: NewsItem) => ({
          title: item.title,
          summary: item.description,
          source: item.source_name,
          url: item.news_url,
          timestamp: item.date,
          price_id: priceId,
          sentiment: determineSentiment(item.title, item.description),
        }));

        await supabaseClient
          .from("news_events")
          .insert(newsItems);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unknown error occurred" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// Simple sentiment analysis function
function determineSentiment(
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
