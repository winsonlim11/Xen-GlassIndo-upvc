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
}
