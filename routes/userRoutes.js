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
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/logout-all", logoutAll);
/*
 *Temporay Get Me
 */
router.get("/getme", getMe);
router.get("/refresh-token", refreshToken);
export default router;
