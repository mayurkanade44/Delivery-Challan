import express from "express";
import {
  createChallan,
  getAllChallan,
  getChallan,
  updateChallan,
} from "../controllers/challanController.js";

const router = express.Router();

router.route("/").get(getAllChallan).post(createChallan);
router.route("/:id").put(updateChallan).get(getChallan);

export default router;
