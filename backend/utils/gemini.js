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
                text: `Analyze the sentiment of this movie review in one word:\n"${review}"\n\nRespond with only one word: Positive, Negative, or Neutral.`,
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

    const lower = raw.toLowerCase();
    let sentiment = null;

    if (/\bpositive\b/.test(lower)) {
      sentiment = "Positive";
    } else if (/\bnegative\b/.test(lower)) {
      sentiment = "Negative";
    } else if (/\bneutral\b/.test(lower)) {
      sentiment = "Neutral";
    }

    if (!sentiment) {
      throw new Error(`Unexpected sentiment response: "${raw}"`);
    }

    return { sentiment, explanation: `Gemini says: ${raw}` };
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return {
      sentiment: "Neutral",
      explanation: "LLM error or unclear response. Defaulted to Neutral.",
    };
  }
}
