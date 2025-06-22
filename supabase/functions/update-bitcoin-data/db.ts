import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { NewsItem } from "./types.ts";
import { GlobalNewsFetcher, CryptoNewsFetcher } from "./news.ts";

const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

export async function handleBitcoinPrice() {
    const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
    );
    const data = await response.json();

    if (!data.bitcoin) {
        throw new Error("Failed to fetch Bitcoin data");
    }

    const price = data.bitcoin.usd;
    const percentChange = data.bitcoin.usd_24h_change;
    const timestampToday = new Date().toISOString();

    const lastInsertedPrice = await supabaseClient
        .from("bitcoin_prices")
        .select("timestamp, id")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

    const lastNewsPosted = await supabaseClient
        .from("news_events")
        .select("timestamp")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

    const lastTimestampPrice = lastInsertedPrice.data?.timestamp;
    const priceId = lastInsertedPrice.data?.id;
    const isSameDay =
        timestampToday.split("T")[0] === lastTimestampPrice?.split("T")[0];
    const lastNewsPostedDate = new Date(lastNewsPosted.data?.timestamp ?? "");

    if (!isSameDay) {
        const { data: insertedRows, error: insertError } = await supabaseClient
            .from("bitcoin_prices")
            .insert([
                {
                    price,
                    percent_change: percentChange,
                    timestamp: timestampToday,
                },
            ])
            .select();
        
        // Get the priceId from the inserted row
        const newPriceId = insertedRows && insertedRows.length > 0 ? insertedRows[0].id : undefined;

        if (insertError) {
            throw insertError;
        }

        const allExistingNewsTitles = await supabaseClient
            .from("news_events")
            .select("title");

        const existingNewsTitles = allExistingNewsTitles?.data?.map((news) =>
            news.title as string
        ) || [];

        const globalFetcher = new GlobalNewsFetcher();
        const globalNewsData = await globalFetcher.fetchNews(
            percentChange,
            newPriceId,
            existingNewsTitles,
            lastNewsPostedDate,
        );
        await InsertNews(globalNewsData);

        const cryptoFetcher = new CryptoNewsFetcher();
        const cryptoNewsData = await cryptoFetcher.fetchNews(
            percentChange,
            priceId,
            existingNewsTitles,
            lastNewsPostedDate,
        );
        await InsertNews(cryptoNewsData);
    }

async function InsertNews(news: NewsItem[]) {
  if (news && news.length > 0) {
    console.log(
      `Inserting ${news.length} news articles for price ID: ${priceId}`,
      news
    );
    await supabaseClient.from("news_events").insert(news)
      .then((result) => {
        if (result.error) {
          console.error(
            "Error inserting news articles:",
            result.error
          );
        } else {
          console.log(
            "News articles inserted successfully:",
            result.data
          );
        }
      });
  }
}
}
