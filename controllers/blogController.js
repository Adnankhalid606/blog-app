import * as blogService from "../services/blogService.js";
//GET ALL BLOG
export const getAllBlogs = async (req, res, next) => {
  try{
    const allBlogs = await blogService.getAllBlogs();
    if(allBlogs.length === 0){
      return res.status(200).json({
        status: true,
        message: "No Notes Found",
        Blogs: allBlogs,
      });
    }
    res.status(200).json({
      status: true,
      Blogs: allBlogs,
    });
  }catch(err){
    next(err);
  }
};

//GET BLOG BY ID
export const getBlogByID = async (req, res, next) => {
  const id = req.params.id;
  try{
    const blog = await blogService.getBlogByID(id);
    if(blog.length === 0){
      return res.status(200).json({
        status: true,
        message: "No Notes Found",
        Blog: blog,
      });
    }
    res.status(200).json({
      status: true,
      Blog: blog,
    });
  }
  catch(err){
    next(err);
  }
};

//POST OR CREATE A BLOG
export const createBlog = async (req, res, next) => {
  const { title, content } = req.body;
  if(!title || !content){
      return res.status(400).json({
          status: false,
          message: "Please enter title and content"
      })
  }
  try{
    const newBlog = await blogService.createBlog(title, content);
    res.status(200).json({
        status: true,
        message: "Blog Created Successfully",
        Blog: newBlog
    })
  }
  catch(err){
    next(err);
  }
};

//UPDATE BLOG BY ID
export const updateBlog = async (req, res, next) => {
  const id = req.params.id;
  const { title, content } = req.body;
  if(!title && !content){
      return res.status(400).json({
          status: false,
          message: "Please enter title or content"
      })
  }
  try{
    const updateBlog = await blogService.updateBlog(id, title, content);
    res.status(200).json({
      status: true,
      message: "Blog Updated Successfully",
      Blog: updateBlog
  })
  }
  catch(err){
    next(err);
  }
};

//DELETE NOTE
export const deleteBlog = async (req, res, next)=>{
    const id = req.params.id;
    try{
      const deleteBlog = await  blogService.deleteBlog(id);
      res.status(200).json({
        status: true,
        message: "Blog Deleted Successfully",
        Blog: deleteBlog
    })
    }
    catch(err){
      next(err);
    }
}