import express from "express";
import { me, logIn, logOut, logoutAll, refreshToken, registerUser, verifyEmail, resendVerificationEmail, requestPasswordReset, resetPassword } from "../controllers/userController.js";
import { protect, protectRefresh } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();
router.post("/register", authLimiter, registerUser);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationEmail);
router.post("/forgot-password", authLimiter, requestPasswordReset);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/login", authLimiter, logIn);
router.post("/logout", protectRefresh, logOut);
router.post("/logout-all", protectRefresh, logoutAll);
router.get("/me", protect, me);
router.post("/refresh-token", authLimiter, protectRefresh, refreshToken);
export default router;