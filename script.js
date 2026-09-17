const modal = document.querySelector('#video-modal');
const frame = document.querySelector('#video-frame');
const title = document.querySelector('#modal-title');
const external = document.querySelector('#video-external');
const closeButton = document.querySelector('.modal-close');
let trigger = null;

document.querySelectorAll('.js-video').forEach((button) => {
  button.addEventListener('click', () => {
    trigger = button;
    title.textContent = button.dataset.title || 'Vidéo';
    frame.src = button.dataset.video;
    external.href = button.dataset.external;
    modal.showModal();
    closeButton.focus();
  });
});

function closeModal() {
  frame.src = '';
  modal.close();
  trigger?.focus();
}

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeModal();
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}
