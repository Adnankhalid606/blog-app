import express from "express";
import * as adminController from "../controllers/adminController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get('/blogs/pending', protect, allowRoles("admin"), adminController.pendingBlogs);
router.get('/blogs/pending/:id', protect, allowRoles("admin"), adminController.pendingBlogWithId);
router.put('/blogs/:id/approve', protect, allowRoles("admin"), adminController.approveBlog);
router.put('/blogs/:id/reject', protect, allowRoles("admin"), adminController.rejectBlog);

export default router;