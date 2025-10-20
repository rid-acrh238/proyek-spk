import { pool } from "../config/db.js";

export async function findUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0];
}

export async function createAdmin(username, hashedPassword) {
  const [result] = await pool.query("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')", [username, hashedPassword]);
  return result.insertId;
}
