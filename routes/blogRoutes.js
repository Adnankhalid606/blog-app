import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  blogsByAuthor,
  publishBlog,
} from "../controllers/blogController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";
import { blogOwnership } from "../middleware/blogOwnership.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.get("/", getAllBlogs);
router.get("/me", protect, allowRoles("author", "admin"), blogsByAuthor);
router.patch("/:id/publish", protect, allowRoles("author", "admin"), blogOwnership, publishBlog);
router.get("/:id", getBlogById);
router.post("/create", protect, allowRoles("author", "admin"), upload.single("image"), createBlog);
router.put("/:id", protect, allowRoles("author", "admin"), blogOwnership, updateBlog);
router.delete("/:id", protect, allowRoles("author", "admin"), blogOwnership, deleteBlog);

export default router;
