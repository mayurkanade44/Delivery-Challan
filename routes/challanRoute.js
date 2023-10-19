import express from "express";
import {
  createChallan,
  getAllChallan,
  getChallan,
  updateChallan,
  verifyAmount,
} from "../controllers/challanController.js";

const router = express.Router();

router.route("/").get(getAllChallan).post(createChallan);
router.put("/verify/:id", verifyAmount);
router.route("/:id").put(updateChallan).get(getChallan);

export default router;
