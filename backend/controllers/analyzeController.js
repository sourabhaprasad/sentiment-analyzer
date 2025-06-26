import Result from "../models/Result.js";
import { runRuleBasedAnalysis } from "../utils/ruleBased.js";
import { analyzeWithGemini } from "../utils/gemini.js";

export const analyzeReview = async (req, res) => {
  const { review, method } = req.body;

  if (!review || !method) {
    return res.status(400).json({ error: "Review and method required" });
  }

  let sentiment = "Neutral";
  let explanation = "";
  let finalMethod = method;

  if (method === "rule") {
    const result = runRuleBasedAnalysis(review);
    sentiment = result.sentiment;
    explanation = result.explanation;
  }

  if (method === "llm") {
    const geminiResult = await analyzeWithGemini(review);

    if (geminiResult) {
      sentiment = geminiResult.sentiment;
      explanation = geminiResult.explanation;
    } else {
      const fallback = runRuleBasedAnalysis(review);
      sentiment = fallback.sentiment;
      explanation = fallback.explanation;
      finalMethod = "rule";
    }
  }

  try {
    const result = await Result.create({
      review,
      method: finalMethod,
      sentiment,
      explanation,
    });

    return res.status(201).json({ id: result._id });
  } catch (err) {
    console.error("DB Save Error:", err);
    return res.status(500).json({ error: "Failed to save result" });
  }
};
