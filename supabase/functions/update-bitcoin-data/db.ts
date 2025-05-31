import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { fetchCryptoNews, fetchGlobalNews as fetchGlobalNews } from "./news.ts";

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
        const { error: insertError } = await supabaseClient
            .from("bitcoin_prices")
            .insert([{
                price,
                percent_change: percentChange,
                timestamp: timestampToday,
            }])
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

        const globalNewsData = await fetchGlobalNews(
            percentChange,
            priceId,
            existingNewsTitles,
            lastNewsPostedDate,
        );
        if (globalNewsData && globalNewsData.length > 0) {
            console.log(
                `Inserting ${globalNewsData.length} global news articles for price ID: ${priceId}`,
                globalNewsData,
            );
            await supabaseClient.from("news_events").insert(globalNewsData);
        }

        const cryptoNewsData = await fetchCryptoNews(
            percentChange,
            priceId,
            existingNewsTitles,
        );
        if (cryptoNewsData && cryptoNewsData.length > 0) {
            console.log(
                `Inserting ${cryptoNewsData.length} crypto news articles for price ID: ${priceId}`,
                cryptoNewsData,
            );
            await supabaseClient.from("news_events").insert(cryptoNewsData)
                .then((result) => {
                    if (result.error) {
                        console.error(
                            "Error inserting crypto news articles:",
                            result.error,
                        );
                    } else {
                        console.log(
                            "Crypto news articles inserted successfully:",
                            result.data,
                        );
                    }
                });
        }
    }
}
