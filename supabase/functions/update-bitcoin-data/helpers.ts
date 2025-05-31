import Sentiment from "npm:sentiment";

export function determineSentiment(
  title: string,
): "positive" | "neutral" | "negative" {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(title);

  if (result.score > 2) return "positive";
  if (result.score < -2) return "negative";
  return "neutral";
}
