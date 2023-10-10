import express from "express";
import { createChallan } from "../controllers/challanController.js";

const router = express.Router();

router.post("/create", createChallan);

export default router;
