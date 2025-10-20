import express from "express";
import { pool } from "../config/db.js";
import { 
    hitungWP, 
    tambahKriteria, 
    tambahAlternatif, 
    tambahNilai, 
    getKriteria, 
    getAlternatif, 
    getNilai, } from "../controllers/spkControllers.js";

const router = express.Router();

// --- Perhitungan Weighted Product ---
router.get("/hitung", async (req, res) => {
  try {
    // Ambil semua data kriteria
    const [kriteria] = await pool.query("SELECT * FROM kriteria");
    const [alternatif] = await pool.query("SELECT * FROM alternatif");
    const [nilai] = await pool.query("SELECT * FROM nilai");

    // Normalisasi bobot
    const totalBobot = kriteria.reduce((sum, k) => sum + k.bobot, 0);
    const normalisasi = kriteria.map((k) => ({
      ...k,
      w: k.bobot / totalBobot,
    }));

    // Hitung vektor S untuk tiap alternatif
    const hasil = alternatif.map((alt) => {
      const nilaiAlt = nilai.filter((n) => n.id_alternatif === alt.id_alternatif);

      let S = 1;
      normalisasi.forEach((k) => {
        const n = nilaiAlt.find((v) => v.id_kriteria === k.id_kriteria);
        if (n) {
          const pangkat = k.tipe === "cost" ? -k.w : k.w;
          S *= Math.pow(n.nilai, pangkat);
        }
      });
      return { ...alt, S };
    });

    // Hitung total S untuk normalisasi vektor V
    const totalS = hasil.reduce((sum, a) => sum + a.S, 0);

    // Hitung nilai preferensi (V)
    const hasilAkhir = hasil.map((a) => ({
      nama_alternatif: a.nama_alternatif,
      nilai_preferensi: a.S / totalS,
    }));

    // Urutkan hasil
    hasilAkhir.sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);

    res.json(hasilAkhir);
  } catch (err) {
    console.error("❌ Error hitung WP:", err);
    res.status(500).json({ message: "Gagal menghitung Weighted Product" });
  }
});

router.get("/calculate", hitungWP);
// 🔹 Tambah data
router.post("/kriteria", tambahKriteria);
router.post("/alternatif", tambahAlternatif);
router.post("/nilai", tambahNilai);

// 🔹 Ambil data
router.get("/kriteria", getKriteria);
router.get("/alternatif", getAlternatif);
router.get("/nilai", getNilai);

export default router;
