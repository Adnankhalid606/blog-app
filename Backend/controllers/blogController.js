import * as blogService from "../services/blogService.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDelete.js";

//GET ALL BLOG
export const getAllBlogs = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const { blogs, totalBlogs } = await blogService.getAllBlogs(
      limit,
      offset,
      search,
    );
    if (blogs.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No Blogs Found",
        blogs: blogs,
      });
    }
    const totalPages = Math.ceil(totalBlogs / limit);
    res.status(200).json({
      status: true,
      page,
      limit,
      totalBlogs,
      totalPages,
      blogs,
    });
  } catch (err) {
    next(err);
  }
};

//GET BLOG BY ID
export const getBlogById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const blog = await blogService.getPublishedBlogByID(id);
    if (!blog) {
      return res.status(200).json({
        status: true,
        message: "No Blogs Found",
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

//POST OR CREATE A BLOG
export const createBlog = async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      status: false,
      message: "Please enter title and content",
    });
  }

  try {
    let image = null;
    let image_public_id = null;

    if (req.file) {
      const cloudinaryImage = await uploadToCloudinary(req.file.buffer);
      image = cloudinaryImage.secure_url;
      image_public_id = cloudinaryImage.public_id;
    }

    const authorId = req.user.id;
    let status = req.user.role === "admin" ? "published" : "draft";

    const newBlog = await blogService.createBlog(
      title,
      content,
      authorId,
      image,
      status,
      image_public_id || "",
    );
    res.status(200).json({
      status: true,
      message: "Blog Created Successfully",
      blog: newBlog,
    });
  } catch (err) {
    next(err);
  }
};

//UPDATE BLOG BY ID
export const updateBlog = async (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;

  if (!title && !content && !req.file) {
    return res.status(400).json({
      status: false,
      message: "Please provide title, content or image",
    });
  }

  try {
    const blog = await blogService.getBlogByID(id);

    let image = blog.image;
    let image_public_id = blog.image_public_id;

    if (req.file) {
      // Delete old image
      if (image_public_id) {
        await deleteFromCloudinary(image_public_id);
      }

      // Upload new image
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      image = uploadedImage.secure_url;
      image_public_id = uploadedImage.public_id;
    }

    const status = req.user.role === "admin" ? "published" : "draft";

    const updatedBlog = await blogService.updateBlog(
      id,
      title,
      content,
      status,
      image,
      image_public_id,
    );

    res.status(200).json({
      status: true,
      message: "Blog Updated Successfully",
      blog: updatedBlog,
    });
  } catch (err) {
    next(err);
  }
};

//Publish Blog or Send Blog for Approval
export const publishBlog = async (req, res, next) => {
  try {
    const id = req.params.id;
    const blog = req.blog;
    if (!["draft", "rejected"].includes(blog.status)) {
      return res.status(400).json({
        status: false,
        message: "Blog cannot be submitted for approval in its current status",
      });
    }

    const publishedBlog = await blogService.publishBlogById(id);
    res.status(200).json({
      status: true,
      message: "Blog submitted for approval",
      blog: publishedBlog,
    });
  } catch (err) {
    next(err);
  }
};

//Get Blog By Author All Blogs even Pending, Draft etc
export const blogsByAuthor = async (req, res, next) => {
  try {
    const authorId = req.user.id;
    const blogs = await blogService.getBlogsByAuthor(authorId);
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

//DELETE Blog
export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  try {
    const blog = await blogService.getBlogByID(id);

    if (blog.image_public_id) {
      await deleteFromCloudinary(blog.image_public_id);
    }

    await blogService.deleteBlog(id);

    res.status(200).json({
      status: true,
      message: "Blog Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
};
