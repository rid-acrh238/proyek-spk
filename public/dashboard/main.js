// === main.js ===
// Dashboard SPK Weighted Product (frontend logic + CRUD)

document.addEventListener("DOMContentLoaded", () => {
  // --- Elemen DOM utama ---
  const sidebar = document.getElementById("sidebar");
  const burgerBtn = document.getElementById("burger-btn");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const content = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-link");
  const logoutBtn = document.getElementById("logout-btn");

  // ==========================
  // ⚙️ Sidebar Toggle
  // ==========================
  function toggleSidebar() {
    sidebar.classList.toggle("-translate-x-full");
    sidebarOverlay.classList.toggle("hidden");
  }

  burgerBtn.addEventListener("click", toggleSidebar);
  sidebarOverlay.addEventListener("click", toggleSidebar);

  // ==========================
  // 🧭 Load Content Navigation
  // ==========================
  function setActiveLink(page) {
    navLinks.forEach((link) => link.classList.remove("active"));
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add("active");
  }

  async function loadContent(page) {
    setActiveLink(page);

    switch (page) {
      case "profil":
        renderProfil();
        break;
      case "kriteria":
        await renderKriteria();
        break;
      case "alternatif":
        await renderAlternatif();
        break;
      case "nilai":
        await renderNilai();
        break;
      case "hasil":
        await renderHasil();
        break;
      case "admin":
        renderAdmin();
        break;
      default:
        content.innerHTML = `<h2 class="text-2xl font-semibold text-gray-700">Halaman tidak ditemukan</h2>`;
    }

    if (window.innerWidth < 768) toggleSidebar();
  }

// ==========================
// 🎨 Helper Modal Functions
// ==========================
function showModal(title, htmlFields, onSubmit) {
  const modal = document.getElementById("modal");
  const titleEl = document.getElementById("modal-title");
  const form = document.getElementById("modal-form");
  const extraFields = document.getElementById("extra-fields");

  titleEl.textContent = title;
  extraFields.innerHTML = htmlFields;
  modal.classList.remove("hidden");

  form.onsubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
    hideModal();
  };

  document.getElementById("cancelModal").onclick = hideModal;
}

function hideModal() {
  document.getElementById("modal").classList.add("hidden");
}

function showLoader() { document.getElementById("loader").classList.remove("hidden"); }
function hideLoader() { document.getElementById("loader").classList.add("hidden"); }


  // ==========================
  // 🧱 Profil (static)
  // ==========================
  function renderProfil() {
    content.innerHTML = `
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Profil Admin</h2>
      <div class="bg-white shadow-md rounded-lg p-6 max-w-xl">
        <p class="text-gray-700 mb-2"><b>Nama:</b> Admin SPK</p>
        <p class="text-gray-700 mb-2"><b>Email:</b> admin@sistem.com</p>
        <button class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md mt-4">
          Edit Profil
        </button>
      </div>
    `;
  }

  // ==========================
  // 🧮 CRUD: Kriteria
  // ==========================
  async function renderKriteria() {
    content.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Manajemen Kriteria</h2>
        <button id="addKriteriaBtn" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">+ Tambah</button>
      </div>
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bobot</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody id="tabelKriteria" class="bg-white divide-y divide-gray-200"></tbody>
        </table>
      </div>
    `;

    const tbody = document.getElementById("tabelKriteria");

    try {
      const res = await fetch("/api/spk/kriteria");
      const data = await res.json();
      tbody.innerHTML = data.map(k => `
        <tr>
          <td class="px-6 py-4">${k.kode_kriteria}</td>
          <td class="px-6 py-4">${k.nama_kriteria}</td>
          <td class="px-6 py-4">${k.bobot}</td>
          <td class="px-6 py-4">${k.tipe}</td>
          <td class="px-6 py-4 text-right">
            <button class="edit-btn text-purple-600" data-id="${k.id_kriteria}">Edit</button>
            <button class="delete-btn text-red-600 ml-4" data-id="${k.id_kriteria}">Hapus</button>
          </td>
        </tr>
      `).join("");

      // Tambah event listener tombol
      tbody.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          Swal.fire({
            title: "Hapus Kriteria?",
            text: "Data ini akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, hapus"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await fetch(`/api/spk/kriteria/${btn.dataset.id}`, { method: "DELETE" });
                Swal.fire("Terhapus!", "Kriteria berhasil dihapus.", "success");
                renderKriteria();
  }
});

        });
      });

    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-4">Gagal memuat data</td></tr>`;
    }

    // Tombol Tambah
    document.getElementById("addKriteriaBtn").addEventListener("click", () => {
  showModal("Tambah Kriteria", `
    <div>
      <label class="block text-sm font-medium text-gray-700">Bobot</label>
      <input id="bobotInput" type="number" step="0.01" class="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Tipe</label>
      <select id="tipeInput" class="mt-1 w-full border border-gray-300 rounded-md px-3 py-2">
        <option value="benefit">Benefit</option>
        <option value="cost">Cost</option>
      </select>
    </div>
  `, async () => {
    const nama = document.getElementById("namaInput").value;
    const bobot = document.getElementById("bobotInput").value;
    const tipe = document.getElementById("tipeInput").value;
    if (nama && bobot) {
      await fetch("/api/spk/kriteria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_kriteria: nama, bobot, tipe })
      });
      Swal.fire("Berhasil!", "Kriteria baru ditambahkan.", "success");
      renderKriteria();
      }
    });
  });
  }

  // ==========================
  // 📋 CRUD: Alternatif
  // ==========================
  async function renderAlternatif() {
    content.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Manajemen Alternatif</h2>
        <button id="addAltBtn" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">+ Tambah</button>
      </div>
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Alternatif</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody id="tabelAlt" class="bg-white divide-y divide-gray-200"></tbody>
        </table>
      </div>
    `;

    const tbody = document.getElementById("tabelAlt");

    try {
      const res = await fetch("/api/spk/alternatif");
      const data = await res.json();
      tbody.innerHTML = data.map(a => `
        <tr>
          <td class="px-6 py-4">${a.kode_alternatif}</td>
          <td class="px-6 py-4">${a.nama_alternatif}</td>
          <td class="px-6 py-4 text-right">
            <button class="text-purple-600 edit-btn" data-id="${a.id_alternatif}">Edit</button>
            <button class="text-red-600 ml-4 delete-btn" data-id="${a.id_alternatif}">Hapus</button>
          </td>
        </tr>`).join("");

      tbody.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (confirm("Hapus alternatif ini?")) {
            await fetch(`/api/spk/alternatif/${btn.dataset.id}`, { method: "DELETE" });
            renderAlternatif();
          }
        });
      });
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-red-500">Gagal memuat data</td></tr>`;
    }

    // Tombol Tambah
    document.getElementById("addAltBtn").addEventListener("click", async () => {
      const nama = prompt("Nama Alternatif:");
      if (nama) {
        await fetch("/api/spk/alternatif", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_alternatif: nama })
        });
        renderAlternatif();
      }
    });
  }

  // ==========================
  // 📊 CRUD: Nilai
  // ==========================
  async function renderNilai() {
    content.innerHTML = `
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Input Nilai Alternatif</h2>
      <div class="bg-white shadow-md rounded-lg p-6">
        <p class="text-gray-500 mb-2">Fitur input nilai antar alternatif & kriteria akan segera aktif.</p>
      </div>
    `;
    // nanti diintegrasi dengan /api/nilai
  }

// ==========================
// 🧮 Hasil WP + Chart.js
// ==========================
async function renderHasil() {
  content.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-700">Hasil Perhitungan Weighted Product</h2>
      <button id="hitungBtn" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Hitung Ulang</button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peringkat</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alternatif</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nilai Preferensi (V)</th>
          </tr>
        </thead>
        <tbody id="hasilTabel" class="bg-white divide-y divide-gray-200"></tbody>
      </table>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-700 mb-3">Visualisasi Nilai Preferensi</h3>
      <canvas id="hasilChart" height="120"></canvas>
    </div>
  `;

  async function loadHasil() {
    try {
      const res = await fetch("/api/spk/hitung");
      const data = await res.json();

      // Tampilkan tabel
      const tbody = document.getElementById("hasilTabel");
      tbody.innerHTML = data
        .map(
          (r, i) => `
          <tr class="${i === 0 ? "bg-purple-50 font-semibold text-purple-800" : ""}">
            <td class="px-6 py-4">${i + 1}</td>
            <td class="px-6 py-4">${r.nama_alternatif}</td>
            <td class="px-6 py-4">${r.nilai_preferensi.toFixed(4)}</td>
          </tr>
        `
        )
        .join("");

      // Buat chart
      const ctx = document.getElementById("hasilChart").getContext("2d");

      // Hapus chart sebelumnya (kalau tombol Hitung Ulang diklik)
      if (window.hasilChart) {
        window.hasilChart.destroy();
      }

      window.hasilChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((d) => d.nama_alternatif),
          datasets: [
            {
              label: "Nilai Preferensi (V)",
              data: data.map((d) => d.nilai_preferensi.toFixed(4)),
              backgroundColor: [
                "rgba(139, 92, 246, 0.6)", // ungu muda
                "rgba(99, 102, 241, 0.6)",
                "rgba(59, 130, 246, 0.6)",
                "rgba(34, 197, 94, 0.6)",
                "rgba(234, 179, 8, 0.6)"
              ],
              borderColor: "#6d28d9",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Nilai Preferensi (V)",
              },
            },
          },
          animations: {
            tension: {
            duration: 1000,
            easing: 'easeInOutBounce',
            from: 1,
            to: 0,
            loop: false
            },
        },

          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    } catch (err) {
      document.getElementById("hasilTabel").innerHTML =
        `<tr><td colspan="3" class="text-center text-red-500 py-4">Gagal memuat hasil</td></tr>`;
    }
  }

  // Jalankan pertama kali
  await loadHasil();

  // Tombol hitung ulang
  document.getElementById("hitungBtn").addEventListener("click", loadHasil);
}


  // ==========================
  // 🔐 Admin (static)
  // ==========================
  function renderAdmin() {
    content.innerHTML = `<h2 class="text-2xl font-semibold text-gray-700">Kelola Admin</h2><p class="text-gray-500">Fitur admin belum diaktifkan.</p>`;
  }

  // ==========================
  // 🚪 Logout
  // ==========================
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Logout diklik!");
  });

  // ==========================
  // 🏁 Init
  // ==========================
  navLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadContent(e.currentTarget.dataset.page);
    })
  );

  loadContent("profil");
});
