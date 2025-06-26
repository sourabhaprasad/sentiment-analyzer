import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  review: { type: String, required: true },
  sentiment: { type: String, required: true },
  method: { type: String, enum: ["llm", "rule"], required: true },
  explanation: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Result", ResultSchema);
