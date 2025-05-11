import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { fetchNews } from "./news.ts";

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
    const timestamp = new Date().toISOString();

    const lastInsertedPrice = await supabaseClient
        .from("bitcoin_prices")
        .select("timestamp, id")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

    const lastTimestamp = lastInsertedPrice.data?.timestamp;
    const priceId = lastInsertedPrice.data?.id;
    const isSameDay = timestamp.split("T")[0] === lastTimestamp?.split("T")[0];

    if (!isSameDay) {
        const { error: insertError } = await supabaseClient
            .from("bitcoin_prices")
            .insert([{ price, percent_change: percentChange, timestamp }])
            .select();

        if (insertError) {
            throw insertError;
        }

        const allExistingNewsTitles = await supabaseClient
            .from("news_events")
            .select("title");

        const existingNewsTitles = allExistingNewsTitles?.data?.map((news) =>
            news.title as string
        ) || [];

        const newsData = await fetchNews(
            timestamp,
            percentChange,
            priceId,
            existingNewsTitles,
            new Date(lastTimestamp)
        );
        if (newsData && newsData.length > 0) {
            await supabaseClient.from("news_events").insert(newsData);
        }
    }
}
