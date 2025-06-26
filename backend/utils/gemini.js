export async function analyzeWithGemini(review) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing.");
    return null;
  }

  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze the sentiment of this movie review and respond in this format:

Sentiment: [Positive|Negative|Neutral]
Explanation: [one short sentence explaining the reasoning]

Review: "${review}"`,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!raw) {
      throw new Error("Empty response from Gemini");
    }

    const sentimentMatch = raw.match(
      /Sentiment:\s*(Positive|Negative|Neutral)/i
    );
    const explanationMatch = raw.match(/Explanation:\s*(.+)/i);

    const sentiment = sentimentMatch?.[1] || null;
    const explanation = explanationMatch?.[1] || "No explanation provided.";

    if (!sentiment) {
      throw new Error(`Unexpected sentiment response: "${raw}"`);
    }

    return { sentiment, explanation };
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return {
      sentiment: "Neutral",
      explanation: "LLM error or unclear response. Defaulted to Neutral.",
    };
  }
}
