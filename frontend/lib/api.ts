const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function analyzeReview(review: string, method: "llm" | "rule") {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ review, method }),
  });

  if (!res.ok) throw new Error("Failed to analyze");

  return res.json();
}

export async function fetchResultById(id: string) {
  const res = await fetch(`${BASE_URL}/results/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Result not found");

  return res.json();
}

export async function fetchAllResults() {
  const res = await fetch(`${BASE_URL}/all`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch results");

  return res.json();
}

export async function deleteResultById(id: string) {
  const res = await fetch(`${BASE_URL}/results/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete result");

  return res.json();
}
