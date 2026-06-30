import { gsap } from 'gsap';

/**
 * Magnetic pull for [data-magnetic] elements (CTAs, mail link).
 * The custom dot/ring cursor was removed — the native cursor is used.
 */
export function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: mx * 0.3, y: my * 0.4, duration: 0.6, ease: 'power3' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
