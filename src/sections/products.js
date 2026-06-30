import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Products — luxury showroom. Personality: CSS sticky stacking. Each card
 * pins full-screen while the next slides up over it. As a card leaves it
 * dims + recedes (scale/blur) so depth reads like panels in a vitrine.
 * Media also gets a subtle counter-parallax. Distinct from every other
 * section's motion (no reveal-up, no horizontal, no mask wipe).
 */
export function initProducts() {
  const cards = gsap.utils.toArray('[data-pcard]');
  if (!cards.length) return;

  // intro lines
  gsap.utils.toArray('.products [data-reveal-line]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // sticky-stack depth — runs on every screen size (mobile included)
  cards.forEach((card, i) => {
    const media = card.querySelector('.pcard__media');
    const body = card.querySelector('.pcard__body');

    // entrance per card
    gsap.from(body.children, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: card, start: 'top 60%' },
    });

    // counter-parallax media
    gsap.fromTo(media, { yPercent: 8 }, {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // recede as the next card stacks over (skip last)
    if (i < cards.length - 1) {
      gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
        scale: 0.92, filter: 'brightness(0.45)', ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true },
      });
    }
  });
}
