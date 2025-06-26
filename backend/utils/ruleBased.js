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
    "highly recommend",
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

  // Handle multi-word phrases first
  const multiWordChecks = [
    { phrases: ["highly recommend", "not bad"], value: 1.5 },
    { phrases: ["not good", "not recommend", "not great"], value: -1.5 },
  ];

  multiWordChecks.forEach(({ phrases, value }) => {
    phrases.forEach((phrase) => {
      if (reviewText.includes(phrase)) {
        score += value;
        if (value > 0) posHits++;
        else negHits++;
      }
    });
  });

  // Word-by-word analysis
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = words[i - 1] || "";

    if (prevWord === "not") {
      if (positiveWords.includes(word)) {
        score -= 1;
        negHits++;
      } else if (negativeWords.includes(word)) {
        score += 1;
        posHits++;
      }
    } else {
      if (positiveWords.includes(word)) {
        score += 1;
        posHits++;
      } else if (negativeWords.includes(word)) {
        score -= 1;
        negHits++;
      } else if (neutralWords.includes(word)) {
        neutralHits++;
      }
    }
  }

  let sentiment = "Neutral";
  if (score > 0.5) sentiment = "Positive";
  else if (score < -0.5) sentiment = "Negative";

  const explanation = `Rule-based: Score = ${score.toFixed(
    1
  )} (Pos: ${posHits}, Neg: ${negHits}, Neutral: ${neutralHits})`;

  return { sentiment, explanation };
}
