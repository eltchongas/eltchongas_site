const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
function closeMenu() { links?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }
menu?.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .02 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
function openDialog(dialog) { closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (dialog.classList.contains('lightbox') || event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
});
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const image = lightbox.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(button => {
    const original = button.querySelector('img');
    button.setAttribute('aria-label', `Ampliar: ${original.alt}`);
    button.addEventListener('click', () => { image.src = original.src; image.alt = original.alt; openDialog(lightbox); });
  });
  lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
}
const contact = document.querySelector('.contact-dialog');
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => openDialog(contact)));
contact?.querySelector('.contact-close').addEventListener('click', () => contact.close());
// Fluid floating icons, orbiting geometry, and pointer response on the About page.
const scene = document.querySelector('.camera-scene');
if (scene) {
  const pieces = [...scene.querySelectorAll('.floating-symbol,.scene-ring,.scene-dot')];
  let raf = 0, visible = true, pointerX = 0, pointerY = 0;
  scene.addEventListener('pointermove', event => { const r = scene.getBoundingClientRect(); pointerX = (event.clientX - r.left) / r.width - .5; pointerY = (event.clientY - r.top) / r.height - .5; });
  scene.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  function draw(time) {
    pieces.forEach((piece, i) => { const t = time / 1800 + i * 1.3; const x = Math.sin(t) * (8 + i) + pointerX * 15; const y = Math.cos(t * .75) * 12 + pointerY * 15; const angle = Math.sin(t * .65) * (i < 4 ? 9 : 25); piece.style.transform = `translate3d(${x}px,${y}px,0) rotate(${angle}deg)`; });
    raf = requestAnimationFrame(draw);
  }
  function sync() { cancelAnimationFrame(raf); if (!reducedMotion.matches && visible && !document.hidden) raf = requestAnimationFrame(draw); else if (reducedMotion.matches) pieces.forEach(p => p.style.transform = ''); }
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(scene);
  reducedMotion.addEventListener('change', sync); document.addEventListener('visibilitychange', sync); sync();
}

// Best effort only: browsers cannot detect OS-level screenshots universally.
const copyrightNotice = document.querySelector('.copyright-notice');
let copyrightReturnFocus = null;
function showCopyrightNotice() {
  if (!copyrightNotice || document.body.classList.contains('copyright-active')) return;
  copyrightReturnFocus = document.activeElement;
  document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
  document.body.classList.add('copyright-active');
  copyrightNotice.setAttribute('role', 'dialog');
  copyrightNotice.setAttribute('aria-modal', 'true');
  [...document.body.children].forEach(el => { if (el !== copyrightNotice && !el.inert) { el.inert = true; el.dataset.copyrightInert = 'true'; } });
  copyrightNotice.querySelector('.copyright-whatsapp').focus();
}
function hideCopyrightNotice() {
  document.body.classList.remove('copyright-active');
  document.querySelectorAll('[data-copyright-inert]').forEach(el => { el.inert = false; delete el.dataset.copyrightInert; });
  copyrightNotice?.removeAttribute('aria-modal');
  copyrightReturnFocus?.focus();
}
copyrightNotice?.querySelector('.copyright-dismiss').addEventListener('click', hideCopyrightNotice);
document.addEventListener('keydown', event => {
  const key = (event.key || '').toLowerCase();
  if (key === 'escape' && document.body.classList.contains('copyright-active')) { hideCopyrightNotice(); return; }
  if ((event.key === 'PrintScreen' || event.code === 'PrintScreen' || event.keyCode === 44) || ((event.ctrlKey || event.metaKey) && key === 'p') || (event.metaKey && event.shiftKey && ['3','4','5'].includes(key)) || (event.metaKey && event.shiftKey && key === 's')) {
    event.preventDefault(); showCopyrightNotice();
  }
});
document.addEventListener('keyup', event => { if ((event.key === 'PrintScreen' || event.code === 'PrintScreen' || event.keyCode === 44)) showCopyrightNotice(); });
document.addEventListener('contextmenu', event => { if (event.target.closest('img, [data-lightbox], .maestro-hero')) { event.preventDefault(); showCopyrightNotice(); } });
document.addEventListener('dragstart', event => { if (event.target.tagName === 'IMG') event.preventDefault(); });
window.addEventListener('beforeprint', showCopyrightNotice);
window.addEventListener('afterprint', hideCopyrightNotice);
