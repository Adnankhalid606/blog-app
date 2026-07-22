import * as blogService from "../services/blogService.js";
//GET ALL BLOG
export const getAllBlogs = async (req, res, next) => {
  try {
    const allBlogs = await blogService.getAllBlogs();
    if (allBlogs.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No Blogs Found",
        blogs: allBlogs,
      });
    }
    res.status(200).json({
      status: true,
      Blogs: allBlogs,
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
  const authorId = req.user.id;
  if (!title || !content) {
    return res.status(400).json({
      status: false,
      message: "Please enter title and content",
    });
  }
  try {
    const newBlog = await blogService.createBlog(title, content, authorId);
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
  if (!title && !content) {
    return res.status(400).json({
      status: false,
      message: "Please enter title or content",
    });
  }
  try {
    const updateBlog = await blogService.updateBlog(id, title, content);
    res.status(200).json({
      status: true,
      message: "Blog Updated Successfully",
      blog: updateBlog,
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
    if (blog.status !== "draft") {
      return res.status(400).json({
        status: false,
        message: "Blog is not in Draft",
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
  try{
      const authorId = req.user.id;
      const blogs = await blogService.getBlogsByAuthor(authorId);
      if(blogs.length === 0){
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
    }
    catch(err){
      next(err);
    }
};

//DELETE NOTE
export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleteBlog = await blogService.deleteBlog(id);
    res.status(200).json({
      status: true,
      message: "Blog Deleted Successfully",
      blog: deleteBlog,
    });
  } catch (err) {
    next(err);
  }
};
