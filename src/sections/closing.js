import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Closing — the final scene. Personality: calm + slow. Floating glass
 * slabs drift on parallax as you approach; the headline scales up gently
 * from a held breath (no snappy reveal); footer columns settle last. The
 * antithesis of the hero's energy — a quiet exhale to end the journey.
 */
export function initClosing() {
  const section = document.querySelector('.closing');
  if (!section) return;

  // headline: clip up + slow scale, like inhaling
  const headSpans = gsap.utils.toArray('[data-closing-head] span');
  headSpans.forEach((s) => (s.innerHTML = `<span class="ln-inner">${s.innerHTML}</span>`));
  const lines = gsap.utils.toArray('[data-closing-head] .ln-inner');
  gsap.set(lines, { yPercent: 110 });
  gsap.timeline({ scrollTrigger: { trigger: '.closing__inner', start: 'top 75%' } })
    .to(lines, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.12 })
    .from('.closing__head', { scale: 0.92, duration: 2, ease: 'expo.out' }, 0)
    .from('.closing__mail, .closing__cta-row', { y: 30, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.15 }, '-=1.2');

  gsap.utils.toArray('.closing [data-reveal-line]').forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  // floating glass slabs — slow parallax drift
  gsap.utils.toArray('[data-closing-glass] i').forEach((slab, i) => {
    gsap.to(slab, {
      yPercent: (i % 2 ? -1 : 1) * (18 + i * 6),
      ease: 'none',
      scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  });

  // footer settle
  gsap.from('.closing__cols > div', {
    y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.closing__foot', start: 'top 90%' },
  });
}
