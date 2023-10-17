import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { loginUser, logoutUser } from "../controllers/userContoller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);

export default router;
