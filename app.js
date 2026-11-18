const modal = document.querySelector('#modal');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('button[data-room]')?.focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelector('#open-room').addEventListener('click', openModal);
document.querySelector('.create-room').addEventListener('click', openModal);
document.querySelector('.text-icon').addEventListener('click', openModal);
document.querySelector('#close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.querySelector('.search-button').focus();
  }
});

document.querySelectorAll('[data-room]').forEach((button) => {
  button.addEventListener('click', () => {
    const roomType = button.dataset.room;
    closeModal();
    showToast(`${roomType} is ready to set up.`);
  });
});

document.querySelectorAll('.join-room').forEach((button) => {
  button.addEventListener('click', (event) => {
    const room = event.currentTarget.closest('.feature-card');
    const name = room.querySelector('h2, h3').innerText.replace('\n', ' ');
    showToast(`Joining ${name}…`);
  });
});

document.querySelectorAll('.activity-action').forEach((button) => {
  button.addEventListener('click', () => showToast('Room details are coming soon.'));
});

document.querySelector('.search-button').addEventListener('click', () => showToast('Search is coming soon. Try exploring a room in the meantime.'));

// The reader is intentionally a mobile-focused prototype, with touch and button navigation.
const reader = document.querySelector('#reader-view');
const readerBooks = [...document.querySelectorAll('.reader-book')];
const readerDots = [...document.querySelectorAll('.reader-dots i')];
const readerPage = document.querySelector('#reader-page');
let selectedBook = 0;
let touchStartX = null;

function selectBook(nextIndex) {
  selectedBook = (nextIndex + readerBooks.length) % readerBooks.length;
  readerBooks.forEach((book, index) => {
    book.classList.toggle('active', index === selectedBook);
    book.classList.toggle('previous', index < selectedBook);
  });
  readerDots.forEach((dot, index) => dot.classList.toggle('selected', index === selectedBook));
}

function showReader() {
  reader.classList.add('open');
  reader.setAttribute('aria-hidden', 'false');
  document.body.classList.add('reader-active');
}

function hideReader() {
  reader.classList.remove('open');
  reader.setAttribute('aria-hidden', 'true');
  readerPage.classList.remove('open');
  readerPage.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('reader-active');
}

document.querySelector('#reader-toggle').addEventListener('click', showReader);
document.querySelector('#reader-back').addEventListener('click', hideReader);
document.querySelector('#reader-next').addEventListener('click', () => selectBook(selectedBook + 1));
document.querySelector('#reader-prev').addEventListener('click', () => selectBook(selectedBook - 1));
const bookStage = document.querySelector('#reader-book-stage');
bookStage.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
bookStage.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 40) selectBook(selectedBook + (distance < 0 ? 1 : -1));
  touchStartX = null;
}, { passive: true });
bookStage.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') selectBook(selectedBook + 1);
  if (event.key === 'ArrowLeft') selectBook(selectedBook - 1);
});
document.querySelector('#reader-open').addEventListener('click', () => {
  const book = readerBooks[selectedBook];
  document.querySelector('#page-title').textContent = book.dataset.title;
  document.querySelector('#page-byline').textContent = book.dataset.author;
  readerPage.classList.add('open');
  readerPage.setAttribute('aria-hidden', 'false');
});
document.querySelector('#page-back').addEventListener('click', () => {
  readerPage.classList.remove('open');
  readerPage.setAttribute('aria-hidden', 'true');
});
document.querySelector('#page-next').addEventListener('click', () => showToast('You reached the end of this sample.'));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && reader.classList.contains('open')) hideReader();
});
