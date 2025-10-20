import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createAdmin } from "../models/userModel.js";

const SECRET_KEY = "INI_RAHASIA";

// === REGISTER ADMIN ===
export async function registerAdmin(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Isi username dan password!" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await createAdmin(username, hashedPassword);
  res.json({ message: "Admin berhasil dibuat!" });
}

// === LOGIN ===
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Semua field wajib diisi!" });

  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

  if (rows.length === 0)
    return res.status(401).json({ message: "Username tidak ditemukan!" });

  const user = rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch)
    return res.status(401).json({ message: "Password salah!" });

  // Buat token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  // Kirim token ke frontend
  res.json({ message: "Login berhasil!", token });
} // ✅ fungsi login selesai di sini

// === LOGOUT (JWT: hapus token di client side) ===
export async function logout(req, res) {
  res.json({ message: "Logout berhasil! Hapus token di client side." });
}

// === CHECK TOKEN / SESSION ===
export async function checkSession(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ loggedIn: false, message: "Token tidak ada" });

  try {
    const user = jwt.verify(token, SECRET_KEY);
    res.json({ loggedIn: true, user });
  } catch (err) {
    res.status(403).json({ loggedIn: false, message: "Token tidak valid" });
  }
}
