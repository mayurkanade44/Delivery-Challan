import express from "express";
import {
  chartData,
  createChallan,
  getAllChallan,
  getChallan,
  updateChallan,
  verifyAmount,
} from "../controllers/challanController.js";

const router = express.Router();

router.route("/").get(getAllChallan).post(createChallan);
router.get("/chartData", chartData);
router.put("/verify/:id", verifyAmount);
router.route("/:id").put(updateChallan).get(getChallan);

export default router;
