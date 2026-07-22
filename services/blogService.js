import db from "../config/dbConnection.js"

//GET ALL BLOGS
export const getAllBlogs = async ()=>{
    const [rows] = await db.query("SELECT * FROM blogs WHERE status = 'published'");
    return rows
}

//GET BLOG BY ID
export const getBlogByID = async (id)=>{
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    return rows;
}

export const getPublishedBlogByID = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM blogs WHERE id = ? AND status = 'published'",
        [id]
    );
    return rows[0];
};

//CREATE A BLOG

export const createBlog = async (title, content, authorId)=>{
    const [result] = await db.query("INSERT INTO blogs (author_id, title, content, status) VALUES (?, ?, ?, 'draft')", [authorId, title, content]);
    const id = result.insertId;
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    return rows;
}

//Publish Blog or Send it to approval

export const publishBlogById = async (id)=>{
    const [result] = await db.query("UPDATE blogs SET status = 'pending' WHERE id = ?", [id]);
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
    return rows[0];
}

//Get Blogs By Author
export const getBlogsByAuthor = async (authorId)=>{
    const [rows] = await db.query("SELECT * FROM blogs WHERE author_id = ?", [authorId]);
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