import { gsap } from 'gsap';

/**
 * Cinematic preloader: a counter + filling rule, then a clip-path
 * "glass wipe" curtain that lifts to reveal the hero. Resolves a promise
 * the moment the curtain begins to lift so the hero reveal can chain in.
 */
export function runPreloader() {
  return new Promise((resolve) => {
    const el = document.querySelector('[data-preloader]');
    const bar = document.querySelector('[data-preloader-bar]');
    const count = document.querySelector('[data-preloader-count]');
    const curtain = document.querySelector('[data-preloader-curtain]');
    if (!el) { resolve(); return; }

    document.documentElement.classList.add('lenis-stopped');
    if (window.__lenis) window.__lenis.stop();

    const state = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (window.__lenis) window.__lenis.start();
        document.documentElement.classList.remove('lenis-stopped');
        el.style.display = 'none';
      },
    });

    tl.to(state, {
      v: 100,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(state.v);
        if (count) count.textContent = v;
        if (bar) bar.style.width = v + '%';
      },
    })
      .to('.preloader__inner', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      // glass wipe up
      .to(curtain, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
      .to(el, { autoAlpha: 0, duration: 0.2 }, '-=0.2')
      .add(() => resolve(), '-=0.9');
  });
}
