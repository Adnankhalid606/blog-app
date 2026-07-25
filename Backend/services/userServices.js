import db from "../config/dbConnection.js";

export const createUser = async (username, email, password) => {
  const [result] = await db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')",
    [username, email, password],
  );
  const userID = result.insertId;
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userID]);
  return rows[0];
};
export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};
export const createSession = async (
  userID,
  hashedRefreshToken,
  ip,
  userAgent,
) => {
  const [result] = await db.query(
    "INSERT INTO sessions (user_id, refresh_token_hash, ip, user_agent) VALUES (?, ?, ?, ?)",
    [userID, hashedRefreshToken, ip, userAgent],
  );
  return result.insertId;
};

export const getSessionsByUserID = async (user_id) => {
  const [result] = await db.query(
    "SELECT id, refresh_token_hash FROM sessions WHERE user_id = ? AND revoked = 0",
    [user_id],
  );
  return result;
};

export const revokeSession = async (session_id) => {
  const [result] = await db.query(
    "UPDATE sessions SET revoked = 1 WHERE id = ?",
    [session_id],
  );
  return result;
};
export const revokeAllSession = async (user_id, currentSessionId) => {
  const [result] = await db.query(
    "UPDATE sessions SET revoked = 1 WHERE user_id = ? AND id != ?",
    [user_id, currentSessionId],
  );
  return result;
};
export const getOtpByEmail = async (email) => {
  const [result] = await db.query("SELECT * FROM otp WHERE email = ?", [email]);
  return result[0];
};
export const deleteOtpByEmail = async (email) => {
  const [result] = await db.query("DELETE FROM otp WHERE email = ?", [email]);
  return result;
};
export const updateVerified = async (id) => {
  const [result] = await db.query(
    "UPDATE users SET verified = 1 WHERE id = ?",
    [id],
  );
  return result;
};
export const createOtp = async (email, user_id, otp_hash) => {
  const [result] = await db.query(
    "INSERT INTO otp (email, user_id, otp_hash) VALUES (?, ?, ?)",
    [email, user_id, otp_hash],
  );
  return result;
};
