"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { analyzeReview } from "@/lib/api";
import Button from "../components/ui/Button";

export default function AnalysisPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"llm" | "rule">("llm");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("method");
    if (saved === "llm" || saved === "rule") setMethod(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("method", method);
  }, [method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = review.trim();

    if (!trimmed) {
      toast.error("Please enter a review.");
      return;
    }

    if (trimmed.length < 5) {
      toast.error("Review is too short.");
      return;
    }

    if (trimmed.length > 1000) {
      toast.error("Review is too long. Try to keep it under 1000 characters.");
      return;
    }

    try {
      setLoading(true);
      const { id } = await analyzeReview(trimmed, method);
      router.push(`/results/${id}`);
    } catch (err) {
      toast.error("Failed to analyze review.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-xl shadow-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Analyze Movie Review
        </h1>

        <div className="mb-5">
          <label
            htmlFor="method-selection"
            className="block font-medium text-gray-700 mb-2"
          >
            Select Method
          </label>
          <div
            id="method-selection"
            className="flex flex-col sm:flex-row gap-4"
          >
            <label htmlFor="method-llm" className="flex items-center gap-2">
              <input
                id="method-llm"
                type="radio"
                name="method"
                value="llm"
                checked={method === "llm"}
                onChange={() => setMethod("llm")}
              />
              <span className="text-gray-700">LLM API</span>
            </label>
            <label htmlFor="method-rule" className="flex items-center gap-2">
              <input
                id="method-rule"
                type="radio"
                name="method"
                value="rule"
                checked={method === "rule"}
                onChange={() => setMethod("rule")}
              />
              <span className="text-gray-700">Rule-Based</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="review"
            className="block font-medium text-gray-700 mb-2"
          >
            Enter your review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            maxLength={1000}
            required
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            placeholder="E.g., The movie was absolutely fantastic with brilliant acting!"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {review.length} / 1000
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !review.trim()}
          className="w-full py-2"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>Analyzing...</span>
            </div>
          ) : (
            "Analyze Sentiment →"
          )}
        </Button>
      </form>
    </div>
  );
}
