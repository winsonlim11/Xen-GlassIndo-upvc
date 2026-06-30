import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Testimonials — cinematic draggable carousel. Personality: pointer-drag
 * with inertia (hand-rolled, no premium plugin). Each card tilts in 3D
 * based on its distance from screen centre, so the row reads as a curved
 * wall of glass you push along. Velocity skews the cards while dragging.
 */
export function initTestimonials() {
  const viewport = document.querySelector('[data-quotes-viewport]');
  const track = document.querySelector('[data-quotes-track]');
  const cards = gsap.utils.toArray('[data-qcard]');
  if (!track || !cards.length) return;

  gsap.utils.toArray('.quotes [data-reveal-line]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  let x = 0;          // current
  let target = 0;     // eased target
  let min = 0;        // max negative scroll
  let velocity = 0;
  let last = 0;
  let dragging = false;

  const measure = () => {
    min = -(track.scrollWidth - viewport.clientWidth + 0); // include right padding feel
    min = Math.min(0, min - 0);
    target = gsap.utils.clamp(min, 0, target);
  };
  measure();
  window.addEventListener('resize', measure);

  // pointer drag
  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    last = e.clientX;
    velocity = 0;
    track.setPointerCapture?.(e.pointerId);
    document.body.classList.add('cursor-hover');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - last;
    last = e.clientX;
    velocity = dx;
    target = gsap.utils.clamp(min, 0, target + dx);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    target = gsap.utils.clamp(min, 0, target + velocity * 8); // throw
    document.body.classList.remove('cursor-hover');
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  // wheel nudges it too (horizontal intent)
  viewport.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      target = gsap.utils.clamp(min, 0, target - e.deltaX);
    }
  }, { passive: true });

  // ambient drift tied to page scroll while section is in view
  ScrollTrigger.create({
    trigger: '.quotes',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      if (dragging) return;
      // gently bias target across the section's scroll progress
      const range = min * 0.5;
      target = gsap.utils.clamp(min, 0, range * (self.progress - 0.25));
    },
  });

  const vw = () => window.innerWidth;
  gsap.ticker.add(() => {
    x += (target - x) * 0.09;
    const skew = gsap.utils.clamp(-14, 14, (target - x) * 0.6);
    gsap.set(track, { x });

    // per-card 3D based on distance from viewport centre
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = (center - vw() / 2) / vw(); // -1..1
      gsap.set(card, {
        rotationY: dist * -16,
        z: -Math.abs(dist) * 180,
        skewX: skew * 0.4,
        opacity: gsap.utils.clamp(0.45, 1, 1 - Math.abs(dist) * 0.55),
      });
    });
  });
}
