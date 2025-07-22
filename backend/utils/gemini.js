import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
dotenv.config();

// 1. Define Zod schema
const schema = z.object({
  sentiment: z.enum(["Positive", "Negative", "Neutral"]),
  explanation: z.string().min(1),
});

// 2. Create Gemini model
const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash", // ✅ correct key
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

// 3. Bind schema directly to model
const modelWithStructure = model.withStructuredOutput(schema);

// 4. Function to invoke model with review input
export async function analyzeWithGemini(review) {
  const userInput = new HumanMessage(
    `Analyze the sentiment of this movie review and return a JSON object with "sentiment" and "explanation".

Review: "${review}"`
  );

  try {
    const structuredOutput = await modelWithStructure.invoke([userInput]);
    return structuredOutput; // Already parsed & validated!
  } catch (err) {
    console.error("Structured Gemini error:", err.message);
    return {
      sentiment: "Neutral",
      explanation: "LLM error or invalid structure. Defaulted to Neutral.",
    };
  }
}
