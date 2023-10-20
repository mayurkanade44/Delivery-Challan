import express from "express";
import {
  chartData,
  createChallan,
  getAllChallan,
  getChallan,
  makeInvoice,
  unverifiedChallans,
  updateChallan,
  verifyAmount,
} from "../controllers/challanController.js";

const router = express.Router();

router.route("/").get(getAllChallan).post(createChallan);
router.get("/chartData", chartData);
router.get("/unverified", unverifiedChallans);
router.put("/verify/:id", verifyAmount);
router.put("/makeInvoice/:id", makeInvoice);
router.route("/:id").put(updateChallan).get(getChallan);

export default router;
