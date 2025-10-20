const API_URL = "http://localhost:3000/api/spk";

async function tambahKriteria() {
  const nama_kriteria = document.getElementById("namaKriteria").value;
  const bobot = parseFloat(document.getElementById("bobotKriteria").value);
  const tipe = document.getElementById("tipeKriteria").value;

  const res = await fetch(`${API_URL}/kriteria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama_kriteria, bobot, tipe }),
  });

  alert((await res.json()).message);
}

async function tambahAlternatif() {
  const nama_obat = document.getElementById("namaObat").value;

  const res = await fetch(`${API_URL}/alternatif`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama_obat }),
  });

  alert((await res.json()).message);
}

async function hitungWP() {
  const res = await fetch(`${API_URL}/calculate`);
  const data = await res.json();

  const tbody = document.querySelector("#hasilTable tbody");
  tbody.innerHTML = "";

  data.hasil.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.nama}</td>
      <td>${row.nilai.toFixed(5)}</td>
      <td>${(row.preferensi * 100).toFixed(2)}%</td>
    `;
    tbody.appendChild(tr);
  });
}
