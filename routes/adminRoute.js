import express from "express";
import {
  addAdminValue,
  deleteAdminValue,
  getAllValues,
} from "../controllers/adminController.js";
const router = express.Router();

router.route("/value").post(addAdminValue).get(getAllValues);
router.delete("/value/:id", deleteAdminValue);

export default router;
