import express from "express";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import spkRoutes from "./routes/spkRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url"

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.static("public"));
// Pastikan Express pakai path absolut
//app.use(express.static(path.join(__dirname, "../public")));
app.use("/dashboard", express.static(path.join(__dirname, "public/dashboard")));

app.use(
  session({
    secret: "rahasia",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/spk", spkRoutes);

app.get("/", (req, res) => {
   const token = req.cookies?.token || null;
   if (token) {
     res.redirect("/dashboard");
   } else {
     res.redirect("/login.html");
   }

});

 app.get("/dashboard.html", (req, res) => {
   res.redirect("/dashboard");
 });

// Tes koneksi MySQL
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL via XAMPP!");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

// --- Tambah Kriteria ---
export async function tambahKriteria(req, res) {
  const { nama_kriteria, bobot, tipe } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES (?, ?, ?)",
      [nama_kriteria, bobot, tipe]
    );
    res.json({ message: "Kriteria berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ Error tambahKriteria:", err);
    res.status(500).json({ message: "Gagal menambah kriteria" });
  }
}

// --- Tambah Alternatif ---
export async function tambahAlternatif(req, res) {
  const { nama_obat } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO alternatif (nama_obat) VALUES (?)",
      [nama_obat]
    );
    res.json({ message: "Alternatif berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ Error tambahAlternatif:", err);
    res.status(500).json({ message: "Gagal menambah alternatif" });
  }
}

// --- Tambah Nilai ---
export async function tambahNilai(req, res) {
  const { id_alternatif, id_kriteria, nilai } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)",
      [id_alternatif, id_kriteria, nilai]
    );
    res.json({ message: "Nilai berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ Error tambahNilai:", err);
    res.status(500).json({ message: "Gagal menambah nilai" });
  }
}

// --- GET Semua Data ---
export async function getKriteria(req, res) {
  const [rows] = await pool.query("SELECT * FROM kriteria");
  res.json(rows);
}

export async function getAlternatif(req, res) {
  const [rows] = await pool.query("SELECT * FROM alternatif");
  res.json(rows);
}

export async function getNilai(req, res) {
  const [rows] = await pool.query("SELECT * FROM nilai");
  res.json(rows);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
