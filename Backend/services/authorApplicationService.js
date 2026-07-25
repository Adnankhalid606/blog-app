import db from "../config/dbConnection.js";
export const createAuthorRequest = async (userId, reason) => {
  const [result] = await db.query(
    "INSERT INTO author_requests (user_id, reason) VALUES (?, ?)",
    [userId, reason],
  );
  return result.insertId;
};
export const getAllRequests = async () => {
  const [result] = await db.query("SELECT * FROM author_requests");
  return result;
};
export const findPendingRequestByUserId = async (userId) => {
  const [result] = await db.query(
    "SELECT * FROM author_requests WHERE user_id = ? AND status = 'pending'",
    [userId],
  );
  return result[0];
};
export const cancelAuthorRequestById = async (id) => {
  const [result] = await db.query(
    "UPDATE author_requests SET status = 'cancelled' WHERE user_id = ?",
    [id],
  );
  return result.affectedRows;
};
export const getAllPendingRequests = async () => {
  const [result] = await db.query(
    "SELECT * FROM author_requests WHERE status = 'pending'",
  );
  return result;
};
export const findAuthorRequestById = async (id) => {
  const [result] = await db.query(
    "SELECT * FROM author_requests WHERE id = ?",
    [id],
  );
  return result[0];
};
export const findAuthorPendingRequestById = async (id) => {
  const [result] = await db.query(
    "SELECT * FROM author_requests WHERE id = ? AND status = 'pending'",
    [id],
  );
  return result[0];
}
export const acceptRequestById = async (id, adminId) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();
  try{
    const [result] = await connection.query(
        "UPDATE author_requests SET status = 'approved', reviewed_by = ?, reviewed_at = NOW() WHERE id = ?",
        [adminId, id],
    )
    const [users] = await connection.query(
        "SELECT user_id FROM author_requests WHERE id = ?",
        [id],
    );
    const user = users[0];
    await connection.query(
        "UPDATE users SET role = 'author' WHERE id = ?",
        [user.user_id],
    );
    await connection.commit();
    return result.affectedRows;
  }
  catch(err){
    await connection.rollback();
    throw err;
  }
  finally{
    connection.release();
  }
};
export const rejectRequestById = async (id, adminId) => {
  const [result] = await db.query(
    "UPDATE author_requests SET status = 'rejected', reviewed_by = ?, reviewed_at = NOW() WHERE id = ?",
    [adminId, id],
  );
  return result.affectedRows;
};
