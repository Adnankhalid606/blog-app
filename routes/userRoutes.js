import express from "express";
import {
  getMe,
  logIn,
  logOut,
  logoutAll,
  refreshToken,
  registerUser,
  verifyEmail,
} from "../controllers/userController.js";
import { protect, protectRefresh } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", logIn);
router.post("/logout", protectRefresh , logOut);
router.post("/logout-all", protect, logoutAll);
router.get("/getme", protect, getMe);
router.get("/refresh-token", protectRefresh, refreshToken);
export default router;
