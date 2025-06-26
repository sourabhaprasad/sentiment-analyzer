import { notFound } from "next/navigation";
import { fetchResultById } from "@/lib/api";
import Link from "next/link";

interface Params {
  id: string;
}

export default async function ResultPage({ params }: { params: Params }) {
  const { id } = params;

  let result;
  try {
    result = await fetchResultById(id);
  } catch (err) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:py-12 flex items-start sm:items-center justify-center">
      <div className="w-full max-w-2xl sm:max-w-xl bg-gray-50 border border-gray-200 p-6 sm:p-8 rounded-xl shadow">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">
          Sentiment Analysis Result
        </h1>

        <div className="mb-5">
          <span className="block text-gray-600 font-medium mb-1">Review:</span>
          <p className="bg-white p-3 rounded border border-gray-200 text-sm sm:text-base whitespace-pre-line">
            {result.review}
          </p>
        </div>

        <div className="mb-5">
          <span className="block text-gray-600 font-medium mb-1">
            Sentiment:
          </span>
          <p
            className={`inline-block px-4 py-2 rounded font-bold text-sm sm:text-base ${
              result.sentiment === "Positive"
                ? "bg-green-100 text-green-700"
                : result.sentiment === "Negative"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {result.sentiment}
          </p>
        </div>

        <div className="mb-5">
          <span className="block text-gray-600 font-medium mb-1">
            Explanation:
          </span>
          <p className="text-sm text-gray-700 italic">
            {result.explanation ||
              "The sentiment was determined based on word usage or model prediction."}
          </p>
        </div>

        <div className="text-xs sm:text-sm text-gray-500 mt-6 text-right">
          Analyzed using:{" "}
          <strong>{result.method?.toUpperCase() || "N/A"}</strong>
          <br />
          {result.timestamp && (
            <span>At: {new Date(result.timestamp).toLocaleString()}</span>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/all">
            <button className="text-blue-600 hover:underline text-sm">
              ← Back to Logs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
