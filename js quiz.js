// ==========================================
// LOGIKA KUIS MINAT BAKAT (20 SOAL LIKERT)
// ==========================================
const questions = [
  "Saya suka memimpin diskusi dan mengarahkan kelompok.",
  "Saya tertarik menganalisis data atau melakukan riset ilmiah.",
  "Saya senang mengajar dan membantu kegiatan sosial di masyarakat.",
  "Saya suka memikirkan ide-ide bisnis atau inovasi baru.",
  "Saya mudah beradaptasi dengan lingkungan baru.",
  "Saya lebih suka bekerja dengan target yang jelas.",
  "Saya tertarik mengikuti kompetisi nasional/internasional.",
  "Saya aktif dalam kegiatan organisasi kemahasiswaan.",
  "Saya peduli dengan isu lingkungan dan pertanian di Indonesia.",
  "Saya senang memecahkan masalah logika matematika/koding.",
  "Saya suka membuat karya seni, desain, atau konten kreatif.",
  "Saya merasa percaya diri berbicara di depan umum (public speaking).",
  "Saya selalu ingin tahu perkembangan teknologi terbaru.",
  "Saya senang menggalang dana atau membuat aksi kepedulian.",
  "Saya lebih suka membaca jurnal atau buku daripada bersosialisasi.",
  "Saya pandai menyusun alur rencana proyek secara terstruktur.",
  "Saya tertarik mendapat beasiswa untuk membantu finansial kuliah.",
  "Saya mudah berempati saat mendengarkan masalah teman.",
  "Saya suka bekerja di lapangan secara praktis daripada di dalam ruangan.",
  "Saya bercita-cita menjadi entrepreneur atau pendiri startup."
];

// Fungsi merender soal ke HTML
function generateQuizUI() {
  const quizContainer = document.getElementById('quizQuestions');
  if (!quizContainer) return;

  let html = '';
  questions.forEach((q, index) => {
    html += `
      <div class="p-4 bg-[#FAF6E9]/60 rounded-xl border border-[#3B7A87]/20 mb-3">
        <p class="font-semibold text-sm mb-3 text-[#2D5B66]">${index + 1}. ${q}</p>
        <div class="flex justify-between items-center max-w-md mx-auto text-xs font-bold text-gray-600">
          <span class="text-gray-400">Sangat Tidak Setuju</span>
          <div class="flex gap-3 md:gap-4">
            ${[1, 2, 3, 4, 5].map(val => `
              <label class="flex flex-col items-center cursor-pointer">
                <input type="radio" name="q${index}" value="${val}" ${val === 3 ? 'checked' : ''} class="accent-[#3B7A87] w-4 h-4">
                <span class="mt-1 text-[11px]">${val}</span>
              </label>
            `).join('')}
          </div>
          <span class="text-[#3B7A87]">Sangat Setuju</span>
        </div>
      </div>
    `;
  });
  quizContainer.innerHTML = html;
}

// Jalankan rendering secara otomatis begitu dokumen siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', generateQuizUI);
} else {
  generateQuizUI();
}

// Logika Submit Kuis & Hitung Skor
function submitQuiz() {
  let total = 0;
  for (let i = 0; i < questions.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) total += parseInt(selected.value);
  }

  const summaryElem = document.getElementById('profileSummary');
  if (summaryElem) {
    summaryElem.innerText = `Berdasarkan 20 pertanyaan kuis, kamu memperoleh skor total ${total}/100. Kamu memiliki kecenderungan minat pada kegiatan pengembangan diri, kepemimpinan, dan proyek berdampak sosial di IPB!`;
  }

  alert(`Selamat! Kuis selesai dengan skor ${total}/100. Rekomendasi kegiatanmu telah disesuaikan.`);
  if (typeof switchTab === 'function') {
    switchTab('rekomendasi');
  }
}

// Tambahkan baris localStorage ini di dalam fungsi submitQuiz() pada js/quiz.js:
function submitQuiz() {
  let total = 0;
  for (let i = 0; i < questions.length; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) total += parseInt(selected.value);
  }

  const summaryText = `Berdasarkan 20 pertanyaan kuis, kamu memperoleh skor total <b>${total}/100</b>. Kamu memiliki kecenderungan minat pada kegiatan pengembangan diri, kepemimpinan, dan proyek berdampak sosial di IPB!`;
  
  // SIMPAN HASIL KUIS KE LOCALSTORAGE
  localStorage.setItem('pathfinder_quiz_summary', summaryText);

  const summaryElem = document.getElementById('profileSummary');
  if (summaryElem) summaryElem.innerHTML = summaryText;

  alert(`Selamat! Kuis selesai dengan skor ${total}/100. Rekomendasi kegiatanmu telah disesuaikan.`);
  if (typeof switchTab === 'function') {
    switchTab('rekomendasi');
  }
}