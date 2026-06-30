import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Nav reveal + active-link sync, plus the fixed "scene rail" that reads
 * out the current architectural environment (Arrival, Studio, Showroom…)
 * and fills as you move through the whole journey.
 */
export function initNav() {
  // entrance
  gsap.from('[data-nav]', { yPercent: -120, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('[data-rail]', { opacity: 0, x: 30, duration: 1, ease: 'power3.out', delay: 0.6 });

  const links = [...document.querySelectorAll('[data-nav-link]')];
  const railIndex = document.querySelector('[data-rail-index]');
  const railLabel = document.querySelector('[data-rail-label]');
  const railFill = document.querySelector('[data-rail-fill]');
  const scenes = [...document.querySelectorAll('[data-scene]')];

  // global progress fill
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      if (railFill) railFill.style.width = (self.progress * 100).toFixed(1) + '%';
    },
  });

  // per-scene label + active nav link
  scenes.forEach((scene) => {
    ScrollTrigger.create({
      trigger: scene,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (!self.isActive) return;
        if (railIndex) railIndex.textContent = scene.dataset.sceneIndex;
        if (railLabel) railLabel.textContent = scene.dataset.scene;
        const id = scene.getAttribute('id');
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
      },
    });
  });

  document.querySelectorAll('[data-year]').forEach((y) => (y.textContent = new Date().getFullYear()));

  initMobileMenu();
}

/** Hamburger → full-screen overlay menu. Locks scroll while open. */
function initMobileMenu() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-navmenu]');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  };

  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));

  // close when a link is tapped (let the smooth-scroll handler run too)
  menu.querySelectorAll('[data-navmenu-link]').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  );

  // close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setOpen(false);
  });
}
