import express from "express";
import {
  me,
  logIn,
  logOut,
  logoutAll,
  refreshToken,
  registerUser,
  verifyEmail,
} from "../controllers/userController.js";
import { allowRoles, protect, protectRefresh } from "../middleware/authMiddleware.js";
import * as adminController from "../controllers/adminController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", logIn);
router.post("/logout", protectRefresh , logOut);
router.post("/logout-all", protectRefresh, logoutAll);
router.get("/me", protect, me);
router.post("/refresh-token", protectRefresh, refreshToken);
export default router;
