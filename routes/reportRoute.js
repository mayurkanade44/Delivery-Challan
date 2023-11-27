import express from "express";
import {
  dailyJobDoneReport,
  dailyReport,
  dailyUnverifiedJobReport,
  monthlySales,
  salesCollectionReport,
} from "../controllers/reportController.js";
const router = express.Router();

router.get("/dailyReport", dailyReport);
router.get("/dailyJobDoneReport", dailyJobDoneReport);
router.get("/dailyUnverifiedJobReport", dailyUnverifiedJobReport);
router.get("/salesCollectionReport", salesCollectionReport);
router.get("/monthlySales", monthlySales);

export default router;
