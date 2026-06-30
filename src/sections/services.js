import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Services — floating glass panels. Personality: panels assemble into the
 * composition with a 3D rotate + depth translate (rotationX/Z, not a flat
 * fade), then respond to the pointer with a subtle parallax tilt — as if
 * the glass is suspended in front of the viewer.
 */
export function initServices() {
  const panels = gsap.utils.toArray('[data-spanel]');
  if (!panels.length) return;

  gsap.utils.toArray('.services [data-reveal-line]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  gsap.set('[data-services-panels]', { perspective: 1200 });
  gsap.set(panels, { transformOrigin: '50% 100%' });

  gsap.from(panels, {
    rotationX: -55,
    z: -260,
    y: 90,
    opacity: 0,
    duration: 1.3,
    ease: 'power4.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '[data-services-panels]', start: 'top 78%' },
  });

  // pointer tilt parallax
  if (!window.matchMedia('(hover: none)').matches) {
    const wrap = document.querySelector('[data-services-panels]');
    wrap.addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      panels.forEach((p, i) => {
        const depth = 1 + (i % 2) * 0.6;
        gsap.to(p, {
          rotationY: px * 10 * depth,
          rotationX: -py * 8 * depth,
          duration: 0.8,
          ease: 'power3',
          overwrite: 'auto',
        });
      });
    });
    wrap.addEventListener('pointerleave', () => {
      gsap.to(panels, { rotationY: 0, rotationX: 0, duration: 1, ease: 'power3' });
    });
  }
}
