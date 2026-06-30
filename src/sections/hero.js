import { gsap } from 'gsap';

/**
 * Hero typography reveal — masked words rise into place, meta + cues
 * fade up after. Called once the preloader curtain begins to lift so the
 * 3D scene and type bloom together.
 */
export function revealHero() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // .from leaves the words at their natural (visible) position when done,
  // and CSS shows them by default — so the title can never end up blank
  // even if this animation is skipped.
  tl.from('.hero__title .word',
    { yPercent: 110, duration: 1.3, stagger: 0.12 })
    .from('[data-hero-fade]', { y: 26, opacity: 0, duration: 1, stagger: 0.12 }, '-=0.85')
    .from('.gitem', { opacity: 0, y: 36, scale: 0.9, duration: 0.9, stagger: 0.05, ease: 'power3.out', clearProps: 'all' }, '-=0.9');
}
