import * as adminService from "../services/adminService.js";
export const pendingBlogs = async (req, res, next) => {
  try {
    const blogs = await adminService.getAllPendingBlogs();
    if (blogs.length === 0) {
      return res.status(404).json({
        status: true,
        message: "No Blogs Found",
        blogs: blogs,
      });
    }
    res.status(200).json({
      status: true,
      blogs: blogs,
    });
  } catch (err) {
    next(err);
  }
};

export const pendingBlogWithId = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await adminService.getPendingBlogById(id);
    if (!blog) {
      return res.status(404).json({
        status: true,
        message: "No Blog Found",
        blog: blog,
      });
    }
    res.status(200).json({
      status: true,
      blog: blog,
    });
  } catch (err) {
    next(err);
  }
};

export const approveBlog = async(req, res, next) => {
    const id = req.params.id;
    try{
        const approvedBlog = await adminService.blogApproveById(id);
        if(approvedBlog === 0) return res.status(404).json({status: false, message: "Blog not found"});
        res.status(200).json({
            status: true,
            message: "Blog Approved Successfully"
        })
    }
    catch(err){
        next(err);
    }
};

export const rejectBlog = async(req, res, next) => {
    const id = req.params.id;
    try{
        const rejectedBlog = await adminService.blogRejectById(id);
        if(rejectedBlog === 0) return res.status(404).json({status: false, message: "Blog not found"});
        res.status(200).json({
            status: true,
            message: "Blog Rejected Successfully"
        })
    }
    catch(err){
        next(err);
    }
};