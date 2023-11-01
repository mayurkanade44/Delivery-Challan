import express from "express";
import {
  addAdminValue,
  deleteAdminValue,
  getAllValues,
} from "../controllers/adminController.js";
import {
  deleteUser,
  getAllUsers,
  registerUser,
} from "../controllers/userContoller.js";
const router = express.Router();

router.route("/value").post(addAdminValue);
router.post("/user", registerUser);
router.get("/allUser", getAllUsers);
router.delete("/value/:id", deleteAdminValue);
router.delete("/user/:id", deleteUser);

export default router;
