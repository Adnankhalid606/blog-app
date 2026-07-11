import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogByID,
} from "../controllers/blogController.js";
const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogByID);
router.post("/create", createBlog);
router.put("/update/:id", updateBlog);
router.delete("/delete/:id", deleteBlog);

export default router;
