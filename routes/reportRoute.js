import express from "express";
import { dailyReport } from "../controllers/reportController.js";
const router = express.Router();

router.get("/dailyReport", dailyReport);

export default router;
