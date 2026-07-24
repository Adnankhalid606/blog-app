import db from "../config/dbConnection.js";

//GET ALL BLOGS
export const getAllBlogs = async (
  limit,
  offset,
  search,
  category
) => {

  let query = `
    SELECT *
    FROM blogs
    WHERE status = 'published'
  `;

  const values = [];

  // Search
  if (search) {
    query += " AND title LIKE ?";
    values.push(`%${search}%`);
  }

  // Category Filter
  if (category) {
    query += " AND category = ?";
    values.push(category);
  }

  query += `
    ORDER BY created_at DESC
    LIMIT ?
    OFFSET ?
  `;

  values.push(limit);
  values.push(offset);

  const [blogs] = await db.query(query, values);


  let countQuery = `
    SELECT COUNT(*) AS totalBlogs
    FROM blogs
    WHERE status = 'published'
  `;

  const countValues = [];

  if (search) {
    countQuery += " AND title LIKE ?";
    countValues.push(`%${search}%`);
  }

  if (category) {
    countQuery += " AND category = ?";
    countValues.push(category);
  }

  const [[countResult]] = await db.query(
    countQuery,
    countValues
  );

  return {
    blogs,
    totalBlogs: countResult.totalBlogs,
  };
};

//GET BLOG BY ID
export const getBlogByID = async (id) => {
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows;
};

export const getPublishedBlogByID = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM blogs WHERE id = ? AND status = 'published'",
    [id],
  );
  return rows[0];
};

//CREATE A BLOG

export const createBlog = async (title, content, authorId, image, status) => {
  const [result] = await db.query(
    "INSERT INTO blogs (author_id, title, content, image, status) VALUES (?, ?, ?, ?, ?)",
    [authorId, title, content, image, status],
  );
  const id = result.insertId;
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows;
};

//Publish Blog or Send it to approval

export const publishBlogById = async (id) => {
  const [result] = await db.query(
    "UPDATE blogs SET status = 'pending' WHERE id = ?",
    [id],
  );
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows[0];
};

//Get Blogs By Author
export const getBlogsByAuthor = async (authorId) => {
  const [rows] = await db.query("SELECT * FROM blogs WHERE author_id = ?", [
    authorId,
  ]);
  return rows;
};
//Update Blog
export const updateBlog = async (id, title, content, status) => {
  const [result] = await db.query(
    `UPDATE blogs
            SET 
                title = coalesce(?, title),
                content = coalesce(?, content),
                status = ?
            WHERE id = ?
        `,
    [title, content, status, id],
  );
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows;
};

//delete Blog
export const deleteBlog = async (id) => {
  const [result] = await db.query("DELETE FROM blogs WHERE id = ?", [id]);
  return result;
};
