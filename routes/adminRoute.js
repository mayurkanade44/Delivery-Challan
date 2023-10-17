import express from "express";
import {
  addAdminValue,
  deleteAdminValue,
  getAllValues,
} from "../controllers/adminController.js";
import { registerUser } from "../controllers/userContoller.js";
const router = express.Router();

router.route("/value").post(addAdminValue).get(getAllValues);
router.delete("/value/:id", deleteAdminValue);
router.post("/user", registerUser)

export default router;
