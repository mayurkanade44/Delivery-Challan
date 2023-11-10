import express from "express";
import {
  dailyJobDoneReport,
  dailyReport,
  dailyUnverifiedJobReport,
} from "../controllers/reportController.js";
const router = express.Router();

router.get("/dailyReport", dailyReport);
router.get("/dailyJobDoneReport", dailyJobDoneReport);
router.get("/dailyUnverifiedJobReport", dailyUnverifiedJobReport);

export default router;
