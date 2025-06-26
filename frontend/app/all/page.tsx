"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchAllResults, deleteResultById } from "@/lib/api";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";

interface ResultLog {
  _id: string;
  method: string;
  review: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  timestamp?: string | number | Date;
  explanation?: string;
}

export default function LogsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    fetchAllResults()
      .then(setData)
      .catch((err) => {
        console.error("Failed to fetch results:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-800">
            Are you sure you want to delete this log?
          </span>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              className="text-sm text-gray-600"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              className="text-sm text-red-600 font-medium"
              onClick={async () => {
                try {
                  await deleteResultById(id);
                  setData((prev) => prev.filter((item) => item._id !== id));
                  toast.dismiss(t.id);
                  toast.success("Log deleted");
                } catch (err) {
                  console.error("Delete failed", err);
                  toast.dismiss(t.id);
                  toast.error("Failed to delete log");
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.review.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sentimentFilter !== "All") {
      filtered = filtered.filter((item) => item.sentiment === sentimentFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp ?? 0).getTime();
      const dateB = new Date(b.timestamp ?? 0).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [data, search, sentimentFilter, sortOrder]);

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sentiment Analysis Logs
        </h1>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full sm:w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm w-full"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Neutral">Neutral</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm w-full"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-[600px] w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Method
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Review
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Sentiment
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (loading) {
                  return (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-400 py-6"
                      >
                        Loading logs...
                      </td>
                    </tr>
                  );
                }
                if (error) {
                  return (
                    <tr>
                      <td colSpan={6} className="text-center text-red-500 py-6">
                        Failed to load logs. Please try again later.
                      </td>
                    </tr>
                  );
                }
                if (filteredData.length === 0) {
                  return (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-500 py-6"
                      >
                        No matching logs.
                      </td>
                    </tr>
                  );
                }
                return filteredData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer group"
                    onClick={() => router.push(`/results/${item._id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 uppercase">
                      {item.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-[300px] truncate">
                      {item.review}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          item.sentiment === "Positive"
                            ? "bg-green-100 text-green-700"
                            : item.sentiment === "Negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "N/A"}
                    </td>
                    <td
                      className="px-4 py-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
