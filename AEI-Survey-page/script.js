'use strict';
const dialog = document.querySelector('#image-dialog');
const detailImage = document.querySelector('#dialog-image');
const imageWrap = document.querySelector('.dialog-image-wrap');
const loading = document.querySelector('.image-loading');
const figures = [...document.querySelectorAll('.figure-open')];
let lastTrigger;
let currentIndex = 0;
let imageRequest = 0;
let suppressClickUntil = 0;
let touchStart;

function clearDetailImage() {
  detailImage.hidden = true;
  detailImage.removeAttribute('src');
  detailImage.alt = '';
}
async function showFigure(index, trigger) {
  currentIndex = (index + figures.length) % figures.length;
  const button = figures[currentIndex];
  if (trigger) lastTrigger = trigger;
  const request = ++imageRequest;
  clearDetailImage();
  loading.hidden = false;
  loading.textContent = 'Loading image…';
  imageWrap.setAttribute('aria-busy', 'true');
  document.querySelector('#dialog-caption').textContent = button.dataset.caption;
  document.querySelector('#image-counter').textContent = `${currentIndex + 1} / ${figures.length}`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  const nextImage = new Image();
  nextImage.src = button.dataset.image;
  try {
    await nextImage.decode();
    if (request !== imageRequest || !dialog.open) return;
    detailImage.src = nextImage.src;
    detailImage.alt = button.dataset.caption;
    detailImage.hidden = false;
    loading.hidden = true;
  } catch {
    if (request !== imageRequest || !dialog.open) return;
    loading.textContent = 'The image could not be loaded. Choose another image or close the viewer to retry.';
  } finally {
    if (request === imageRequest) imageWrap.setAttribute('aria-busy', 'false');
  }
}
figures.forEach((button, index) => button.addEventListener('click', () => showFigure(index, button)));
function resetViewer() {
  ++imageRequest;
  clearDetailImage();
  loading.hidden = true;
  imageWrap.setAttribute('aria-busy', 'false');
  touchStart = undefined;
}
function closeViewer() {
  resetViewer();
  dialog.close();
}
document.querySelector('#close-dialog').addEventListener('click', closeViewer);
document.querySelector('#previous-image').addEventListener('click', () => showFigure(currentIndex - 1));
document.querySelector('#next-image').addEventListener('click', () => showFigure(currentIndex + 1));
dialog.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    showFigure(currentIndex - 1);
  } else if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    showFigure(currentIndex + 1);
  }
});
imageWrap.addEventListener('click', event => {
  if (event.target.closest('button') || performance.now() < suppressClickUntil) return;
  closeViewer();
});
imageWrap.addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 && !event.target.closest('button')
    ? {x: event.touches[0].clientX, y: event.touches[0].clientY}
    : undefined;
}, {passive: true});
imageWrap.addEventListener('touchend', event => {
  if (!touchStart || event.touches.length) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  touchStart = undefined;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;
  event.preventDefault();
  suppressClickUntil = performance.now() + 450;
  const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
  showFigure(currentIndex + (delta < 0 ? 1 : -1));
}, {passive: false});
imageWrap.addEventListener('touchcancel', () => { touchStart = undefined; }, {passive: true});
dialog.addEventListener('cancel', resetViewer);
dialog.addEventListener('click', event => {
  if (event.target === dialog) closeViewer();
});
dialog.addEventListener('close', () => {
  // Ignore an earlier close event if another image has already opened.
  if (dialog.open) return;
  resetViewer();
  document.body.classList.remove('modal-open');
  lastTrigger?.focus({preventScroll: true});
});
const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map(a => document.querySelector(a.hash));
const nav = document.querySelector('.section-nav');
let scheduled = false;
let activeLink;
let pendingLink;
function paintActive(link) {
  if (!link) return;
  links.forEach(a => {
    const active = a === link;
    a.classList.toggle('active', active);
    if (active) {
      a.setAttribute('aria-current', 'location');
      if (activeLink !== a) {
        const parent = a.parentElement;
        const linkBounds = a.getBoundingClientRect();
        const navBounds = parent.getBoundingClientRect();
        if (linkBounds.left < navBounds.left) {
          parent.scrollLeft += linkBounds.left - navBounds.left - 12;
        } else if (linkBounds.right > navBounds.right) {
          parent.scrollLeft += linkBounds.right - navBounds.right + 12;
        }
        activeLink = a;
      }
    } else a.removeAttribute('aria-current');
  });
}
function updateReading() {
  scheduled = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';

  const navRect = nav.getBoundingClientRect();
  const beforeChapters = navRect.top > 1;
  nav.classList.toggle('before-chapters', beforeChapters);
  if (beforeChapters) return;

  // Chapter anchors land on section boundaries, above their padded headings.
  const readingLine = navRect.height + 100;
  let currentIndex = 0;
  for (const [index, section] of sections.entries()) {
    if (section.getBoundingClientRect().top > readingLine) break;
    currentIndex = index;
  }
  if (max > 0 && scrollY >= max - 2) currentIndex = sections.length - 1;

  const currentLink = links[currentIndex];
  if (pendingLink === currentLink) pendingLink = null;
  paintActive(pendingLink ?? currentLink);
}
function scheduleReadingUpdate() {
  if (!scheduled) { requestAnimationFrame(updateReading); scheduled = true; }
}
links.forEach((link, index) => link.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  pendingLink = link;
  paintActive(link);
  sections[index].scrollIntoView({block: 'start'});
  scheduleReadingUpdate();
}));
function releasePendingNavigation() {
  pendingLink = null;
  scheduleReadingUpdate();
}
addEventListener('wheel', releasePendingNavigation, {passive: true});
document.addEventListener('touchstart', releasePendingNavigation, {passive: true});
addEventListener('scrollend', releasePendingNavigation);
addEventListener('scroll', scheduleReadingUpdate, {passive: true});
addEventListener('resize', scheduleReadingUpdate);
updateReading();
