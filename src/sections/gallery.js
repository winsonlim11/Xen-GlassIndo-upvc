import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

/**
 * Aperture gallery — a vanilla port of the FlipReveal component using the
 * (free) GSAP Flip plugin. Filtering windows / doors / facades records the
 * grid state, toggles visibility, then Flips items to their new positions
 * with scale + stagger; entering items grow in, leaving items shrink out.
 */
export function initGallery() {
  const grid = document.querySelector('[data-flip-grid]');
  if (!grid) return;

  const items = gsap.utils.toArray('[data-flip]', grid);
  const filters = gsap.utils.toArray('[data-filter]');

  const isShown = (key, sel) => sel === 'all' || key === sel;

  function apply(sel) {
    const state = Flip.getState(items);

    items.forEach((item) => {
      const key = item.getAttribute('data-flip');
      item.classList.toggle('is-hidden', !isShown(key, sel));
    });

    Flip.from(state, {
      duration: 0.6,
      scale: true,
      ease: 'power1.inOut',
      stagger: 0.05,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0, duration: 0.6 }),
    });
  }

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      filters.forEach((b) => b.classList.toggle('is-active', b === btn));
      apply(btn.dataset.filter);
    });
  });

  initLightbox(items);
}

/** Click a gallery image → open it enlarged in a lightbox. */
function initLightbox(items) {
  const box = document.querySelector('[data-lightbox]');
  const bigImg = document.querySelector('[data-lightbox-img]');
  const closeBtn = document.querySelector('[data-lightbox-close]');
  if (!box || !bigImg) return;

  const open = (src, alt) => {
    // request a larger version of the same Unsplash image
    bigImg.src = src.replace(/w=\d+/, 'w=1600');
    bigImg.alt = alt || '';
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    if (window.__lenis) window.__lenis.stop();
    gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo('.lightbox__fig', { scale: 0.92, y: 16 }, { scale: 1, y: 0, duration: 0.5, ease: 'expo.out' });
  };
  const close = () => {
    gsap.to(box, { autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      bigImg.src = '';
    }});
    if (window.__lenis) window.__lenis.start();
  };

  items.forEach((fig) => {
    const img = fig.querySelector('img');
    if (!img) return;
    fig.style.cursor = 'zoom-in';
    fig.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  });

  closeBtn?.addEventListener('click', close);
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box.classList.contains('is-open')) close();
  });
}
