import express from "express";
import {
  acceptApplicationById,
  applyForAuthor,
  cancelAuthorApplication,
  getAllApplications,
  getAllPendingApplications,
  getApplicationById,
  rejectApplicationById,
} from "../controllers/authorApplicationController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/application", protect, applyForAuthor);
router.patch("/application/cancel", protect, cancelAuthorApplication);
router.get("/application", protect, allowRoles("admin"), getAllApplications);
router.get(
  "/application/pending",
  protect,
  allowRoles("admin"),
  getAllPendingApplications,
);
router.get(
  "/application/:id",
  protect,
  allowRoles("admin"),
  getApplicationById,
);
router.patch(
  "/application/:id/accept",
  protect,
  allowRoles("admin"),
  acceptApplicationById,
);
router.patch(
  "/application/:id/reject",
  protect,
  allowRoles("admin"),
  rejectApplicationById,
);
export default router;
