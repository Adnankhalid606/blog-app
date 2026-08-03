import api from "./api";

export async function getAllBlogs(){
    try{return api.get("/blogs");}
    catch (err){
        console.log(err);
    }
}
export async function getBlogById(id){
    return api.get(`/blogs/${id}`);
}