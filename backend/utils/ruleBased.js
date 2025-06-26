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

  let posCount = 0;
  let negCount = 0;
  let isNeutral = false;

  // Handle multi-word phrases like "highly recommend" and "not bad"
  const reviewText = cleanedReview;

  const checkPhrase = (phraseList) =>
    phraseList.reduce(
      (acc, phrase) => (reviewText.includes(phrase) ? acc + 1 : acc),
      0
    );

  posCount += checkPhrase(["highly recommend"]);
  negCount += checkPhrase(["not good", "not great", "not recommend"]);
  isNeutral = reviewText.includes("not bad") || reviewText.includes("so-so");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = words[i - 1] || "";

    if (prevWord === "not") {
      if (positiveWords.includes(word)) negCount++;
      else if (negativeWords.includes(word)) posCount++;
    } else {
      if (positiveWords.includes(word)) posCount++;
      else if (negativeWords.includes(word)) negCount++;
      else if (neutralWords.includes(word)) isNeutral = true;
    }
  }

  let sentiment = "Neutral";
  if (posCount > negCount) sentiment = "Positive";
  else if (negCount > posCount) sentiment = "Negative";
  else if (posCount === 0 && negCount === 0 && !isNeutral)
    sentiment = "Neutral";

  const explanation = `Rule-based: Found ${posCount} positive, ${negCount} negative word(s)${
    isNeutral ? ", and some neutral terms." : "."
  }`;

  return { sentiment, explanation };
}
