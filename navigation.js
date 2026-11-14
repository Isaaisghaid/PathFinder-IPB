// ==========================================
// LOGIKA PERPINDAHAN TAB (SINGLE PAGE APP)
// ==========================================
function switchTab(tabName) {
  const tabHome = document.getElementById('tab-home');
  const tabKuis = document.getElementById('tab-kuis');
  const tabRekomendasi = document.getElementById('tab-rekomendasi');

  // 1. Sembunyikan semua tab
  if (tabHome) tabHome.classList.add('hidden');
  if (tabKuis) tabKuis.classList.add('hidden');
  if (tabRekomendasi) tabRekomendasi.classList.add('hidden');

  // 2. Tampilkan tab yang dipilih & render ulang kuis jika perlu
  if (tabName === 'home' && tabHome) {
    tabHome.classList.remove('hidden');
  } else if (tabName === 'kuis' && tabKuis) {
    tabKuis.classList.remove('hidden');
    if (typeof generateQuizUI === 'function') {
      generateQuizUI();
    }
  } else if (tabName === 'rekomendasi' && tabRekomendasi) {
    tabRekomendasi.classList.remove('hidden');
  }

  // 3. Scroll ke atas otomatis
  window.scrollTo({ top: 0, behavior: 'smooth' });
}