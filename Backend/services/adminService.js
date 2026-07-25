import db from "../config/dbConnection.js";
export const getAllPendingBlogs = async ()=>{
    const [rows] = await db.query("SELECT * FROM blogs WHERE status = 'pending'");
    return rows;
}
export const getPendingBlogById = async (id)=>{
    const [rows] = await db.query("SELECT * FROM blogs WHERE id = ? AND status = 'pending'", [id]);
    return rows[0];
}

export const blogApproveById = async (id)=>{
    const [result] = await db.query("UPDATE blogs SET status = 'published' WHERE id = ? AND status = 'pending'", [id]);
    return result.affectedRows;
}
export const blogRejectById = async (id)=>{
    const [result] = await db.query("UPDATE blogs SET status = 'rejected' WHERE id = ? AND status = 'pending'", [id]);
    return result.affectedRows;
}