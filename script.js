// Intro splash gate
const intro = document.getElementById('intro');
const enterBtn = document.getElementById('enter-btn');
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    intro.classList.add('hidden');
  });
}

// Back-to-top button
const topBtn = document.getElementById('top-btn');
if (topBtn) {
  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('visible', window.scrollY > 400);
  });
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
