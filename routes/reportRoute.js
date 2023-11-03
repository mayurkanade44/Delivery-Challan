import express from "express";
import {
  dailyJobDoneReport,
  dailyReport,
} from "../controllers/reportController.js";
const router = express.Router();

router.get("/dailyReport", dailyReport);
router.get("/dailyJobDoneReport", dailyJobDoneReport);

export default router;
