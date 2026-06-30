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

  // value marquee drifts against scroll direction
  const drift = document.querySelector('[data-about-drift]');
  if (drift) {
    gsap.to(drift, {
      xPercent: -30,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }
}
