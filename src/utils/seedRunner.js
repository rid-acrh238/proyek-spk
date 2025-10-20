import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    console.log("🧩 Menyisipkan data dummy tanpa menghapus data lama...");

    const kriteria = [
      { nama: "Efektivitas", bobot: 0.35, tipe: "benefit" },
      { nama: "Efek Samping", bobot: 0.25, tipe: "cost" },
      { nama: "Harga", bobot: 0.20, tipe: "cost" },
      { nama: "Ketersediaan", bobot: 0.10, tipe: "benefit" },
      { nama: "Kemudahan Konsumsi", bobot: 0.10, tipe: "benefit" },
    ];

    const alternatif = [
      { nama: "Captopril" },
      { nama: "Amlodipine" },
      { nama: "Losartan" },
      { nama: "Furosemide" },
    ];

    console.log("📥 Memasukkan data kriteria jika belum ada...");
    for (const k of kriteria) {
      const [cek] = await conn.query(
        "SELECT COUNT(*) AS jumlah FROM kriteria WHERE nama_kriteria = ?",
        [k.nama]
      );
      if (cek[0].jumlah === 0) {
        await conn.query(
          "INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES (?, ?, ?)",
          [k.nama, k.bobot, k.tipe]
        );
        console.log(`  ➕ Tambah kriteria: ${k.nama}`);
      }
    }

    console.log("📥 Memasukkan data alternatif jika belum ada...");
    for (const a of alternatif) {
      const [cek] = await conn.query(
        "SELECT COUNT(*) AS jumlah FROM alternatif WHERE nama_obat = ?",
        [a.nama]
      );
      if (cek[0].jumlah === 0) {
        await conn.query(
          "INSERT INTO alternatif (nama_obat) VALUES (?)",
          [a.nama]
        );
        console.log(`  ➕ Tambah alternatif: ${a.nama}`);
      }
    }

    console.log("📥 Memasukkan nilai hanya jika belum ada...");
    // Ambil ulang id dari DB supaya akurat
    const [daftarAlt] = await conn.query("SELECT * FROM alternatif");
    const [daftarKri] = await conn.query("SELECT * FROM kriteria");

    // Data nilai (berdasarkan urutan nama)
    const nilaiData = {
      Captopril: [8, 5, 7, 9, 8],
      Amlodipine: [9, 6, 6, 8, 9],
      Losartan: [7, 4, 8, 7, 8],
      Furosemide: [6, 7, 5, 8, 7],
    };

    for (const alt of daftarAlt) {
      const nilaiArr = nilaiData[alt.nama_obat];
      if (!nilaiArr) continue;
      for (let i = 0; i < daftarKri.length; i++) {
        const kri = daftarKri[i];
        const [cekNilai] = await conn.query(
          "SELECT COUNT(*) AS jumlah FROM nilai WHERE id_alternatif = ? AND id_kriteria = ?",
          [alt.id_alternatif, kri.id_kriteria]
        );
        if (cekNilai[0].jumlah === 0) {
          await conn.query(
            "INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES (?, ?, ?)",
            [alt.id_alternatif, kri.id_kriteria, nilaiArr[i]]
          );
        }
      }
    }

    await conn.commit();
    console.log("✅ Seeding non-destruktif selesai tanpa duplikasi!");
  } catch (err) {
    await conn.rollback();
    console.error("❌ Gagal seeding:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
