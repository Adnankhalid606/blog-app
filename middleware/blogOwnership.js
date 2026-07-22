import { getBlogByID } from "../services/blogService.js";

export const blogOwnership = async (req, res, next)=>{
    if(req.user.role === "admin") return next();
    const userId = req.user.id;
    const blogId = req.params.id;
    try{
        let blog = await getBlogByID(blogId);
        if(blog.length === 0) return res.status(404).json({status: false, message: "Blog not found"})
        blog = blog[0];
        if(blog.author_id !== userId){
            return res.status(403).json({
                status: false,
                message: "You are not the owner of this blog."
            })
        }
        req.blog = blog;
        next()
    }
    catch(err){
        next(err);
    }
};