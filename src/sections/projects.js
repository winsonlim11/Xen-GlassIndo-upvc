import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Projects — horizontal storytelling. Personality: the section pins and
 * vertical scroll is translated into a horizontal pan across full-bleed
 * project scenes. Each panel's background drifts at its own rate for depth.
 * One panel is an interactive before/after the visitor can drag.
 */
export function initProjects() {
  const pin = document.querySelector('[data-projects-pin]');
  const track = document.querySelector('[data-projects-track]');
  if (!pin || !track) return;

  // horizontal storytelling — runs on every screen size (mobile included)
  const getScroll = () => track.scrollWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: () => -(getScroll()),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => '+=' + getScroll(),
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // per-panel background depth (parallax within horizontal motion)
  gsap.utils.toArray('.ppanel__bg').forEach((bg) => {
    gsap.fromTo(bg, { xPercent: -8 }, {
      xPercent: 8, ease: 'none',
      scrollTrigger: {
        trigger: bg.closest('.ppanel'),
        containerAnimation: tween,
        start: 'left right',
        end: 'right left',
        scrub: true,
      },
    });
  });

  initCompare();
}

/** Draggable before/after seam — works with pointer + keyboard. */
function initCompare() {
  const root = document.querySelector('[data-compare]');
  if (!root) return;
  const before = root.querySelector('[data-compare-before]');
  const handle = root.querySelector('[data-compare-handle]');
  let dragging = false;

  const set = (clientX) => {
    const r = root.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    before.style.width = pct + '%';
    handle.style.left = pct + '%';
  };

  const start = (e) => { dragging = true; e.stopPropagation(); set(e.clientX ?? e.touches[0].clientX); };
  const move = (e) => { if (!dragging) return; set(e.clientX ?? e.touches[0].clientX); };
  const end = () => (dragging = false);

  handle.addEventListener('pointerdown', start);
  root.addEventListener('pointerdown', start);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
}
