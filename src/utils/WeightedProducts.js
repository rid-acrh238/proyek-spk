// src/utils/weightedProduct.js

/**
 * Weighted Product Method
 * @param {Array} alternatifs - Daftar alternatif, misal [{ nama: "Captopril", nilai: [0.9, 0.6, 0.7, 0.8] }]
 * @param {Array} bobot - Bobot masing-masing kriteria, misal [0.4, 0.3, 0.2, 0.1]
 * @param {Array} tipe - Jenis kriteria: "benefit" atau "cost"
 */
export function weightedProduct(alternatifs, bobot, tipe) {
  // Normalisasi bobot agar total = 1
  const total = bobot.reduce((a, b) => a + b, 0);
  const w = bobot.map((b) => b / total);

  // Proses WP
  const hasil = alternatifs.map((alt) => {
    let score = 1;
    for (let i = 0; i < w.length; i++) {
      const nilai = Number(alt.nilai[i]);
      // Jika cost → dikalikan dengan pangkat negatif
      score *= Math.pow(nilai, tipe[i] === "cost" ? -w[i] : w[i]);
    }
    return { nama: alt.nama, nilai: score };
  });

  // Normalisasi hasil
  const totalScore = hasil.reduce((sum, h) => sum + h.nilai, 0);
  return hasil
    .map((h) => ({ ...h, preferensi: h.nilai / totalScore }))
    .sort((a, b) => b.preferensi - a.preferensi);
}
