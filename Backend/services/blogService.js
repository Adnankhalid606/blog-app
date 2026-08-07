import db from "../config/dbConnection.js";

export const getAllBlogs = async (limit, offset, search, category) => {
  let query = `SELECT blogs.*, users.username AS author_name FROM blogs JOIN users ON users.id = blogs.author_id WHERE blogs.status = 'published'`;
  const values = [];
  if (search) {
    query += " AND blogs.title LIKE ?";
    values.push(`%${search}%`);
  }
  if (category) {
    query += " AND blogs.category = ?";
    values.push(category);
  }
  query += " ORDER BY blogs.created_at DESC LIMIT ? OFFSET ?";
  values.push(limit, offset);
  const [blogs] = await db.query(query, values);
  let countQuery =
    "SELECT COUNT(*) AS totalBlogs FROM blogs WHERE status = 'published'";
  const countValues = [];
  if (search) {
    countQuery += " AND title LIKE ?";
    countValues.push(`%${search}%`);
  }
  if (category) {
    countQuery += " AND category = ?";
    countValues.push(category);
  }
  const [[countResult]] = await db.query(countQuery, countValues);
  return { blogs, totalBlogs: countResult.totalBlogs };
};

export const getBlogByID = async (id) => {
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows;
};
export const getPublishedBlogByID = async (id) => {
  const [rows] = await db.query(
    "SELECT blogs.*, users.username AS author_name FROM blogs JOIN users ON users.id = blogs.author_id WHERE blogs.id = ? AND blogs.status = 'published'",
    [id],
  );
  return rows[0];
};
export const createBlog = async (
  title,
  content,
  authorId,
  image,
  status,
  image_public_id,
) => {
  const [result] = await db.query(
    "INSERT INTO blogs (author_id, title, content, image, image_public_id, status) VALUES (?, ?, ?, ?, ?, ?)",
    [authorId, title, content, image, image_public_id, status],
  );
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [
    result.insertId,
  ]);
  return rows;
};
export const publishBlogById = async (id) => {
  await db.query("UPDATE blogs SET status = 'pending' WHERE id = ?", [id]);
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows[0];
};
export const getBlogsByAuthor = async (authorId) => {
  const [rows] = await db.query(
    "SELECT blogs.*, users.username AS author_name FROM blogs JOIN users ON users.id = blogs.author_id WHERE blogs.author_id = ?",
    [authorId],
  );
  return rows;
};
export const updateBlog = async (
  id,
  title,
  content,
  status,
  image,
  image_public_id,
) => {
  await db.query(
    `UPDATE blogs
     SET
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        status = ?,
        image = COALESCE(?, image),
        image_public_id = COALESCE(?, image_public_id)
     WHERE id = ?`,
    [title, content, status, image, image_public_id, id],
  );

  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);

  return rows[0];
};
export const deleteBlog = async (id) => {
  const [result] = await db.query("DELETE FROM blogs WHERE id = ?", [id]);
  return result;
};
