"use client";
import { useRouter } from "next/navigation";
import Button from "./components/ui/Button";

export default function Home() {
  const router = useRouter();

  return (
    <section
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: "url('/images/theater-bg.jpg')" }}
    >
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 space-y-8">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
          Movie Sentiment Analyzer
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Card 1 */}
          <div className="bg-white/70 p-6 rounded-xl shadow hover:shadow-md transition duration-300">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              LLM API (Gemini)
            </h2>
            <p className="text-sm text-gray-700">
              Uses Google Gemini API to analyze sentiment via advanced language
              modeling.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/70 p-6 rounded-xl shadow hover:shadow-md transition duration-300">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Rule-Based Method
            </h2>
            <p className="text-sm text-gray-700">
              Simple word-based matching of positive and negative terms in your
              review.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push("/analysis")}
            className="px-6 py-3 rounded-lg shadow-md duration-300"
          >
            Use the Sentiment Analyzer →
          </Button>
        </div>
      </div>
    </section>
  );
}
