export function runRuleBasedAnalysis(review) {
  const positiveWords = [
    "great",
    "amazing",
    "good",
    "excellent",
    "fantastic",
    "wonderful",
    "superb",
    "awesome",
    "brilliant",
    "outstanding",
    "incredible",
    "perfect",
    "enjoyable",
    "love",
    "loved",
    "like",
    "liked",
    "best",
    "favorite",
    "recommend",
    "recommended",
    "masterpiece",
    "captivating",
    "riveting",
    "thrilling",
    "heartwarming",
    "touching",
    "super",
    "fun",
    "delightful",
    "entertaining",
    "mind-blowing",
    "spectacular",
    "impressive",
    "emotional",
    "refreshing",
  ];

  const negativeWords = [
    "bad",
    "terrible",
    "poor",
    "awful",
    "boring",
    "worst",
    "disappointing",
    "mediocre",
    "horrible",
    "dull",
    "unwatchable",
    "lame",
    "predictable",
    "overrated",
    "forgettable",
    "ridiculous",
    "cringeworthy",
    "waste",
    "hate",
    "hated",
    "flawed",
    "annoying",
    "underwhelming",
    "flat",
  ];

  const neutralWords = [
    "okay",
    "fine",
    "average",
    "decent",
    "meh",
    "so-so",
    "not bad",
    "nothing special",
    "fair",
    "satisfactory",
    "middling",
    "passable",
  ];

  const cleanedReview = review.toLowerCase().replace(/[^\w\s]/g, "");
  const words = cleanedReview.split(/\s+/);
  const reviewText = cleanedReview;

  let score = 0;
  let posHits = 0;
  let negHits = 0;
  let neutralHits = 0;

  // Multi-word phrases
  const phraseMap = [
    { phrase: "highly recommend", value: 1.5, type: "pos" },
    { phrase: "not bad", value: 1.0, type: "pos" },
    { phrase: "not good", value: -1.5, type: "neg" },
    { phrase: "not recommend", value: -1.5, type: "neg" },
    { phrase: "not great", value: -1.5, type: "neg" },
    { phrase: "so-so", value: 0, type: "neutral" },
  ];

  for (const { phrase, value, type } of phraseMap) {
    if (reviewText.includes(phrase)) {
      score += value;
      if (type === "pos") posHits++;
      else if (type === "neg") negHits++;
      else if (type === "neutral") neutralHits++;
    }
  }

  // Word-by-word scoring with negation check
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prev1 = words[i - 1] || "";
    const prev2 = words[i - 2] || "";
    const isNegated = prev1 === "not" || prev2 === "not";

    if (positiveWords.includes(word)) {
      if (isNegated) {
        score -= 1;
        negHits++;
      } else {
        score += 1;
        posHits++;
      }
    } else if (negativeWords.includes(word)) {
      if (isNegated) {
        score += 1;
        posHits++;
      } else {
        score -= 1;
        negHits++;
      }
    } else if (neutralWords.includes(word)) {
      neutralHits++;
    }
  }

  // Thresholding
  let sentiment = "Neutral";
  if (score > 1.0) sentiment = "Positive";
  else if (score < -1.0) sentiment = "Negative";

  const explanation = `Rule-based: Score = ${score.toFixed(
    1
  )} (Pos: ${posHits}, Neg: ${negHits}, Neutral: ${neutralHits})`;

  return { sentiment, explanation };
}
