import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Service area — ONE real map of North Sumatra. Collapsed it shows a teaser;
 * tapping it expands the panel and reveals an interactive Leaflet map (dark
 * CARTO tiles to match the theme) with every service city pinned at once.
 * A side legend flies the map to each city. Map inits lazily on first open.
 */
const CITIES = [
  { name: 'Medan',            tag: 'Kantor Pusat',  lat: 3.5952, lng: 98.6722 },
  { name: 'Binjai',           tag: 'Area Layanan', lat: 3.6001, lng: 98.4854 },
  { name: 'Tebing Tinggi',    tag: 'Area Layanan', lat: 3.3285, lng: 99.1625 },
  { name: 'Pematang Siantar', tag: 'Area Layanan', lat: 2.9595, lng: 99.0687 },
  { name: 'Tanjung Balai',    tag: 'Area Layanan', lat: 2.9685, lng: 99.7986 },
  { name: 'Kisaran',          tag: 'Area Layanan', lat: 2.9833, lng: 99.6167 },
];

export function initCoverage() {
  const card = document.querySelector('[data-map-card]');
  if (!card) return;

  const teaser = card.querySelector('[data-map-teaser]');
  const canvas = card.querySelector('[data-map-canvas]');
  const legend = card.querySelector('[data-map-legend]');

  // reveal on scroll
  gsap.from(card, {
    y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: card, start: 'top 85%' },
  });

  let map = null;
  let markers = [];

  function buildMap() {
    map = L.map(canvas, {
      zoomControl: true,
      scrollWheelZoom: false, // don't hijack page scroll (Lenis)
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const pts = [];
    CITIES.forEach((c) => {
      const icon = L.divIcon({
        className: 'umarker',
        html: `<span class="umarker__dot${c.tag === 'Kantor Pusat' ? ' is-head' : ''}"></span><span class="umarker__label">${c.name}</span>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      const m = L.marker([c.lat, c.lng], { icon }).addTo(map);
      m.bindPopup(`<b>${c.name}</b><br><span style="opacity:.7">${c.tag}</span>`);
      markers.push(m);
      pts.push([c.lat, c.lng]);
    });

    map.fitBounds(pts, { padding: [42, 42] });

    // build legend
    legend.innerHTML = CITIES.map((c, i) =>
      `<li data-city="${i}"><span class="dot${c.tag === 'Kantor Pusat' ? ' is-head' : ''}"></span>${c.name}<em>${c.tag}</em></li>`
    ).join('');
    legend.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => {
        const c = CITIES[+li.dataset.city];
        map.flyTo([c.lat, c.lng], 12, { duration: 1.1 });
        markers[+li.dataset.city].openPopup();
      });
    });
  }

  function open() {
    if (card.classList.contains('is-open')) return;
    card.classList.add('is-open');
    card.setAttribute('aria-expanded', 'true');
    // wait for the expand transition to give the container its height
    setTimeout(() => {
      if (!map) buildMap();
      map.invalidateSize();
      const pts = CITIES.map((c) => [c.lat, c.lng]);
      map.fitBounds(pts, { padding: [42, 42] });
      ScrollTrigger.refresh();
    }, 600);
  }

  teaser.addEventListener('click', open);
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
}
