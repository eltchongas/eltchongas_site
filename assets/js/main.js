const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');

addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20), { passive: true });
menu.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  links.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const collections = [...document.querySelectorAll('[data-carousel]')];
function setCurrentCollection(activeSection) {
  collections.forEach((section) => {
    const active = section === activeSection;
    section.classList.toggle('is-current', active);
    section.querySelector('.carousel').tabIndex = active ? 0 : -1;
    section.toggleAttribute('aria-current', active);
  });
}

let collectionFrame = 0;
function updateCurrentCollection() {
  cancelAnimationFrame(collectionFrame);
  collectionFrame = requestAnimationFrame(() => {
    const viewportTarget = innerHeight * 0.48;
    let closest = null;
    let closestDistance = Infinity;
    collections.forEach((section) => {
      const box = section.getBoundingClientRect();
      if (box.bottom < 80 || box.top > innerHeight) return;
      const sectionTarget = Math.max(box.top, Math.min(viewportTarget, box.bottom));
      const distance = Math.abs(sectionTarget - viewportTarget);
      if (distance < closestDistance) {
        closest = section;
        closestDistance = distance;
      }
    });
    if (closest) setCurrentCollection(closest);
  });
}
addEventListener('scroll', updateCurrentCollection, { passive: true });
addEventListener('resize', updateCurrentCollection, { passive: true });

collections.forEach((section) => {
  const rail = section.querySelector('.carousel');
  const slides = [...rail.querySelectorAll('.slide')];
  const current = section.querySelector('.counter b');
  const total = section.querySelector('.counter');
  const bar = section.querySelector('.progress i');
  let index = 0;
  total.lastChild.textContent = ` / ${String(slides.length).padStart(2, '0')}`;
  bar.style.width = `${100 / slides.length}%`;

  function render(nextIndex, shouldScroll = true) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === index));
    current.textContent = String(index + 1).padStart(2, '0');
    bar.style.transform = `translateX(${index * 100}%)`;
    if (shouldScroll) {
      const slide = slides[index];
      const left = slide.offsetLeft - (rail.clientWidth - slide.offsetWidth) / 2;
      rail.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  section.querySelector('[data-prev]').addEventListener('click', () => { setCurrentCollection(section); render(index - 1); });
  section.querySelector('[data-next]').addEventListener('click', () => { setCurrentCollection(section); render(index + 1); });
  rail.addEventListener('pointerdown', () => setCurrentCollection(section));
  rail.addEventListener('focus', () => setCurrentCollection(section));
  rail.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); render(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); render(index - 1); }
  });

  let scrollTimer;
  rail.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = rail.scrollLeft + rail.clientWidth / 2;
      let nearest = 0;
      let distance = Infinity;
      slides.forEach((slide, slideIndex) => {
        const delta = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        if (delta < distance) { distance = delta; nearest = slideIndex; }
      });
      render(nearest, false);
    }, 90);
  }, { passive: true });
});
updateCurrentCollection();

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const caption = dialog.querySelector('p');
document.querySelectorAll('[data-lightbox]').forEach((button) => button.addEventListener('click', () => {
  const image = button.querySelector('img');
  dialogImage.src = image.src;
  dialogImage.alt = image.alt;
  caption.textContent = image.alt;
  dialog.showModal();
}));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const halo = document.querySelector('.cursor-halo');
if (matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', (event) => {
    halo.style.left = `${event.clientX}px`;
    halo.style.top = `${event.clientY}px`;
    halo.classList.add('show');
  });
  document.querySelectorAll('a,button').forEach((element) => {
    element.addEventListener('pointerenter', () => halo.classList.add('active'));
    element.addEventListener('pointerleave', () => halo.classList.remove('active'));
  });
}
