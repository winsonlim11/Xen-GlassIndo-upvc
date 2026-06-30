import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Payment / rekening cards. Each card copies its account number to the
 * clipboard on tap and flashes "Tersalin!" feedback. Cards reveal with a
 * staggered lift on scroll.
 */
export function initPayment() {
  const cards = gsap.utils.toArray('[data-bankcard]');
  if (!cards.length) return;

  gsap.from(cards, {
    y: 50, opacity: 0, rotateX: -12, transformOrigin: '50% 100%',
    duration: 0.9, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '[data-payment]', start: 'top 82%' },
  });

  cards.forEach((card) => {
    const label = card.querySelector('[data-copy-label]');
    const defaultText = label ? label.textContent : '';
    let timer;

    const copy = async () => {
      const rek = card.dataset.rek || '';
      try {
        await navigator.clipboard.writeText(rek);
      } catch {
        // fallback for non-secure contexts
        const ta = document.createElement('textarea');
        ta.value = rek; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch {}
        ta.remove();
      }
      card.classList.add('is-copied');
      if (label) label.textContent = '✓ Tersalin!';
      clearTimeout(timer);
      timer = setTimeout(() => {
        card.classList.remove('is-copied');
        if (label) label.textContent = defaultText;
      }, 1800);
    };

    card.addEventListener('click', copy);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Salin nomor rekening ${card.dataset.rek}`);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });
  });
}
