-- Hapus data lama (biar aman kalau dijalankan ulang)
DELETE FROM nilai;
DELETE FROM alternatif;
DELETE FROM kriteria;

-- Tambah data kriteria
INSERT INTO kriteria (nama_kriteria, bobot, tipe) VALUES
('Efektivitas', 0.4, 'benefit'),
('Efek Samping', 0.3, 'cost'),
('Harga', 0.2, 'cost'),
('Ketersediaan', 0.1, 'benefit');

-- Tambah data alternatif (obat)
INSERT INTO alternatif (nama_obat) VALUES
('Captopril'),
('Amlodipine'),
('Losartan');

-- Tambah nilai tiap obat untuk masing-masing kriteria
-- Format: (id_alternatif, id_kriteria, nilai)
INSERT INTO nilai (id_alternatif, id_kriteria, nilai) VALUES
(1, 1, 0.9), (1, 2, 0.6), (1, 3, 0.7), (1, 4, 0.8),
(2, 1, 0.8), (2, 2, 0.9), (2, 3, 0.5), (2, 4, 0.7),
(3, 1, 0.7), (3, 2, 0.8), (3, 3, 0.6), (3, 4, 0.9);
