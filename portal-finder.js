// ==========================================
// LOGIKA PORAL FINDER (SAVE, LOAD, DELETE PROFIL)
// ==========================================

let uploadedAvatarData = "";

// 1. Load Data Profil & Kuis dari localStorage saat Halaman Ditinggal/Dimuat
document.addEventListener('DOMContentLoaded', () => {
  loadSavedProfile();
  loadSavedQuizResult();
});

// Preview Foto Profil
function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedAvatarData = e.target.result;
      document.getElementById('displayAvatar').src = uploadedAvatarData;
    }
    reader.readAsDataURL(file);
  }
}

// Simpan Profil ke localStorage
function saveProfile(e) {
  e.preventDefault();
  
  const name = document.getElementById('profileName').value;
  const nim = document.getElementById('profileNim').value;
  const bio = document.getElementById('profileBio').value;

  const profileData = {
    name: name,
    nim: nim,
    bio: bio,
    avatar: uploadedAvatarData || document.getElementById('displayAvatar').src
  };

  localStorage.setItem('pathfinder_user_profile', JSON.stringify(profileData));
  updateProfileDisplay(profileData);

  alert("Profil berhasil disimpan! 💾");
}

// Muat Profil yang Tersimpan
function loadSavedProfile() {
  const savedData = localStorage.getItem('pathfinder_user_profile');
  if (savedData) {
    const profile = JSON.parse(savedData);
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileNim').value = profile.nim || '';
    document.getElementById('profileBio').value = profile.bio || '';
    if (profile.avatar) {
      document.getElementById('displayAvatar').src = profile.avatar;
      uploadedAvatarData = profile.avatar;
    }
    updateProfileDisplay(profile);
  }
}

// Perbarui Tampilan Teks Profil
function updateProfileDisplay(data) {
  if (data.name) document.getElementById('displayNama').innerText = data.name;
  if (data.nim) document.getElementById('displayNim').innerText = "NIM: " + data.nim;
}

// Hapus/Reset Profil
function deleteProfile() {
  if (confirm("Apakah kamu yakin ingin menghapus data profilmu?")) {
    localStorage.removeItem('pathfinder_user_profile');
    document.getElementById('formProfile').reset();
    document.getElementById('displayNama').innerText = "Nama Mahasiswa";
    document.getElementById('displayNim').innerText = "NIM: G1401231000";
    document.getElementById('displayAvatar').src = "https://via.placeholder.com/150?text=Foto+Profil";
    uploadedAvatarData = "";
    alert("Profil berhasil di-reset! 🗑️");
  }
}

// Muat Hasil Skor Kuis dari localStorage
function loadSavedQuizResult() {
  const savedSummary = localStorage.getItem('pathfinder_quiz_summary');
  const summaryElem = document.getElementById('finderProfileSummary');
  if (savedSummary && summaryElem) {
    summaryElem.innerHTML = savedSummary;
  }
}

// Hapus Organisasi yang Diminati dari Daftar Track
function removeSavedOrg(btn) {
  const item = btn.closest('div');
  if (item) item.remove();
}