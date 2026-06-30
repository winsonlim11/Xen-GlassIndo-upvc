import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * About — editorial split. Personality: a vertical mask wipe uncovers the
 * image while it scales down from a push-in; headline lines clip up one by
 * one; a marquee of values drifts horizontally against scroll; numbers
 * count up. No fade-up here — everything is masking + parallax.
 */
export function initAbout() {
  const section = document.querySelector('.about');
  if (!section) return;

  // image: mask wipes down, image settles from scale-up
  gsap.timeline({ scrollTrigger: { trigger: '.about__media', start: 'top 80%' } })
    .to('[data-about-mask]', { scaleY: 0, duration: 1.3, ease: 'expo.inOut' })
    .to('[data-about-parallax]', { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);

  // continuous parallax on the image inside its frame
  gsap.to('[data-about-parallax]', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // headline lines clip up (wrap inner so the outer span masks)
  const lineSpans = gsap.utils.toArray('[data-mask-lines] span');
  lineSpans.forEach((s) => (s.innerHTML = `<span class="ln-inner">${s.innerHTML}</span>`));
  const inners = gsap.utils.toArray('[data-mask-lines] .ln-inner');
  gsap.set(inners, { yPercent: 110 });
  gsap.to(inners, {
    yPercent: 0,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '[data-mask-lines]', start: 'top 78%' },
  });

  // body + kicker
  gsap.utils.toArray('.about [data-reveal-line]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // count-up stats
  gsap.utils.toArray('[data-about-stats] b').forEach((b) => {
    const end = +b.dataset.count;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: b, start: 'top 88%' },
      onUpdate: () => (b.textContent = Math.round(obj.v)),
    });
  });

  // photo strip — auto-scrolling infinite marquee that is also draggable
  initStrip(document.querySelector('[data-about-drift]'));
}

function initStrip(strip) {
  if (!strip) return;

  // duplicate the photos once so the loop is seamless
  strip.innerHTML += strip.innerHTML;
  strip.style.cursor = 'grab';

  let half = 0;                 // width of one (original) set
  const measure = () => { half = strip.scrollWidth / 2; };
  measure();
  window.addEventListener('load', measure);
  window.addEventListener('resize', measure);

  let x = 0;
  const speed = 0.4;            // px per frame (auto drift)
  let dragging = false;
  let startX = 0, startPos = 0;

  const wrap = () => {
    if (!half) return;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
  };

  gsap.ticker.add(() => {
    if (!half) measure();
    if (!dragging) x -= speed;
    wrap();
    gsap.set(strip, { x });
  });

  strip.style.pointerEvents = 'auto';
  strip.addEventListener('pointerdown', (e) => {
    dragging = true; startX = e.clientX; startPos = x;
    strip.style.cursor = 'grabbing';
    strip.setPointerCapture?.(e.pointerId);
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    x = startPos + (e.clientX - startX);
    wrap();
  });
  const release = () => { dragging = false; strip.style.cursor = 'grab'; };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
}
