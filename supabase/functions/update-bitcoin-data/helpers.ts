export function determineSentiment(
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
  