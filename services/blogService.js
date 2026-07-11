import db from "../config/dbConnection.js"

//GET ALL BLOGS
export const getAllBlogs = async ()=>{
    const [rows] = await db.query("SELECT * FROM blogs");
    return rows
}

//GET BLOG BY ID
export const getBlogByID = async (id)=>{
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    return rows
}

//CREATE A BLOG

export const createBlog = async (title, content)=>{
    const [result] = await db.query("INSERT INTO blogs (title, content) VALUES (?, ?)", [title, content]);
    const id = result.insertId;
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    return rows;
}

//Update Blog
export const updateBlog = async (id, title, content)=>{
    const [result] = await db.query(`UPDATE blogs
            SET 
                title = coalesce(?, title),
                content = coalesce(?, content)
            WHERE id = ?
        `, [title, content, id]);
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    return rows
}

//delete Blog
export const deleteBlog = async (id)=>{
    const [result] = await db.query("DELETE FROM blogs WHERE id = ?", [id]);
    return result
}