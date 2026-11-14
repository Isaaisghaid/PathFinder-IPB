// Fungsi Tombol Panah Kiri / Kanan
function scrollGallery(direction) {
  const track = document.getElementById('glimpseTrack');
  if (!track) return;
  const scrollAmount = 540;
  track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Fungsi Drag-to-Scroll dengan Mouse di Desktop
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('glimpseTrack');
  if (!slider) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.remove('scroll-smooth');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.add('scroll-smooth');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.add('scroll-smooth');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
  });
});