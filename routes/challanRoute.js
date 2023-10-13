import express from "express";
import {
  createChallan,
  getChallan,
  updateChallan,
} from "../controllers/challanController.js";

const router = express.Router();

router.post("/create", createChallan);
router.route("/:id").put(updateChallan).get(getChallan);

export default router;
