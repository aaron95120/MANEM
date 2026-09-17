const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero');

if (!reduceMotion) root.classList.add('motion-ready');

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

const revealItems = [...document.querySelectorAll('.reveal')];
document.querySelectorAll('.project-grid, .phone-grid, .process-grid, .results-grid, .skill-grid, .timeline, .artistic-images').forEach((container) => {
  [...container.children].forEach((child, index) => {
    if (!child.classList.contains('reveal')) child.classList.add('reveal');
    child.style.setProperty('--reveal-delay', `${Math.min(index * 85, 340)}ms`);
    if (!revealItems.includes(child)) revealItems.push(child);
  });
});

if (!reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((element) => observer.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add('is-visible'));
}

let ticking = false;
function updateScrollMotion() {
  const y = window.scrollY;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  root.style.setProperty('--scroll-progress', Math.min(y / maxScroll, 1));
  header?.classList.toggle('is-scrolled', y > 28);

  if (!reduceMotion && hero && y < window.innerHeight * 1.2) {
    const progress = Math.min(y / window.innerHeight, 1);
    hero.style.setProperty('--hero-parallax', `${y * 0.16}px`);
    hero.style.setProperty('--hero-copy-y', `${y * 0.07}px`);
    hero.style.setProperty('--hero-copy-opacity', Math.max(1 - progress * 0.9, 0.1));
  }
  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScrollMotion);
    ticking = true;
  }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
updateScrollMotion();
