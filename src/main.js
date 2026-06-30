import './styles/base.css';
import './styles/chrome.css';
import './styles/sections.css';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSmoothScroll } from './core/smoothScroll.js';
import { initMagnetic } from './core/cursor.js';
import { runPreloader } from './core/preloader.js';
import { initNav } from './core/nav.js';
import { revealHero } from './sections/hero.js';
import { initGallery } from './sections/gallery.js';
import { initAbout } from './sections/about.js';
import { initProducts } from './sections/products.js';
import { initProjects } from './sections/projects.js';
import { initServices } from './sections/services.js';
import { initTestimonials } from './sections/testimonials.js';
import { initCoverage } from './sections/coverage.js';
import { initPayment } from './sections/payment.js';
import { initClosing } from './sections/closing.js';

/**
 * UPV° — boot sequence.
 * Smooth scroll first (shared GSAP clock), then chrome, scenes, and the
 * preloader. Hero type + 3D bloom the instant the curtain lifts.
 */
function boot() {
  initSmoothScroll();
  initMagnetic();
  initNav();

  // all scroll scenes mount before the curtain lifts
  initGallery();
  initAbout();
  initProducts();
  initProjects();
  initServices();
  initTestimonials();
  initCoverage();
  initPayment();
  initClosing();

  // ensure layout/pin measurements are correct once fonts + images settle
  ScrollTrigger.refresh();
  window.addEventListener('load', () => ScrollTrigger.refresh());

  runPreloader().then(() => {
    revealHero();
    ScrollTrigger.refresh();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
