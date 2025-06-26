import express from "express";
import {
  getAllResults,
  getResultById,
  deleteResultById,
} from "../controllers/resultController.js";

const router = express.Router();

router.get("/", getAllResults);
router.get("/:id", getResultById);
router.delete("/:id", deleteResultById);

export default router;
