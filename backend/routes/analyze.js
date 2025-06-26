import express from "express";
import { analyzeReview } from "../controllers/analyzeController.js";

const router = express.Router();
router.post("/", analyzeReview);

export default router;
