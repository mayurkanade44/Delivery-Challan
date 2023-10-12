import express from "express";
import { addAdminValue, getAllValues } from "../controllers/adminController.js";
const router = express.Router();

router.route("/value").post(addAdminValue).get(getAllValues);

export default router;
