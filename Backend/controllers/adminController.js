import * as adminService from "../services/adminService.js";

export const pendingBlogs = async (req, res, next) => {
  try {
    const blogs = await adminService.getAllPendingBlogs();
    res.status(200).json({ status: true, blogs });
  } catch (err) {
    next(err);
  }
};

export const pendingBlogWithId = async (req, res, next) => {
  try {
    const blog = await adminService.getPendingBlogById(req.params.id);
    if (!blog) return res.status(404).json({ status: false, message: "No Blog Found" });
    res.status(200).json({ status: true, blog });
  } catch (err) {
    next(err);
  }
};

export const approveBlog = async (req, res, next) => {
  try {
    const approvedBlog = await adminService.blogApproveById(req.params.id);
    if (approvedBlog === 0) return res.status(404).json({ status: false, message: "Blog not found" });
    res.status(200).json({ status: true, message: "Blog Approved Successfully" });
  } catch (err) {
    next(err);
  }
};

export const rejectBlog = async (req, res, next) => {
  try {
    const rejectedBlog = await adminService.blogRejectById(req.params.id);
    if (rejectedBlog === 0) return res.status(404).json({ status: false, message: "Blog not found" });
    res.status(200).json({ status: true, message: "Blog Rejected Successfully" });
  } catch (err) {
    next(err);
  }
};