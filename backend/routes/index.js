import express from "express";
import analyzeRoute from "./analyze.js";
import resultsRoute from "./results.js";

const router = express.Router();

router.get("/", (req, res) => res.send("API is working!"));

router.use("/analyze", analyzeRoute);
router.use("/results", resultsRoute);
router.use("/all", resultsRoute);

export default router;
