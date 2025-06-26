import Result from "../models/Result.js";

export const getAllResults = async (req, res) => {
  const results = await Result.find().sort({ timestamp: -1 });
  res.json(results);
};

export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteResultById = async (req, res) => {
  try {
    const deleted = await Result.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete result" });
  }
};
