// src/controllers/spkController.js
import { pool } from "../config/db.js";
import express from "express";
import { weightedProduct } from "../utils/WeightedProducts.js";

export async function hitungWP(req, res) {
  try {
    const [kriteria] = await pool.query("SELECT * FROM kriteria");
    const [alternatif] = await pool.query("SELECT * FROM alternatif");
    const [nilai] = await pool.query(
      "SELECT id_alternatif, id_kriteria, nilai FROM nilai ORDER BY id_alternatif, id_kriteria"
    );


    // Ambil data untuk WP
    const bobot = kriteria.map((k) => Number(k.bobot));
    const tipe = kriteria.map((k) => k.tipe);

    const alternatifs = alternatif.map((alt) => {
      const nilaiAlt = nilai
        .filter((n) => n.id_alternatif === alt.id_alternatif)
        .map((n) => Number(n.nilai));
      return { nama: alt.nama_obat, nilai: nilaiAlt };
    });

    const hasil = weightedProduct(alternatifs, bobot, tipe);

    res.json({
      message: "Perhitungan Weighted Product berhasil",
      hasil,
    });
  } catch (err) {
    console.error("❌ Error WP:", err);
    res.status(500).json({ message: "Gagal menghitung WP", error: err.message });
  }
}

export async function getAlternatif(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM alternatif");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getAlternatif:", err);
    res.status(500).json({ message: "Gagal mengambil data alternatif" });
  }
}

export async function getKriteria(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM kriteria");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getKriteria:", err);
    res.status(500).json({ message: "Gagal mengambil data kriteria"});
  }
}

export async function getNilai(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM nilai");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getNilai:", err);
    res.status(500).json({ message: "Gagal mengambil data nilai" });
  }
}

// --- Tambah Kriteria ---
export async function tambahKriteria(req, res) {
  const { nama_kriteria, bobot, tipe } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES (?, ?, ?)",
      [nama_kriteria, bobot, tipe]
    );
    res.json({ message: "✅ Kriteria berhasil ditambahkan", id: result.insertId });
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
    res.json({ message: "✅ Alternatif berhasil ditambahkan", id: result.insertId });
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
    res.json({ message: "✅ Nilai berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("❌ Error tambahNilai:", err);
    res.status(500).json({ message: "Gagal menambah nilai" });
  }
}
