import './style.css'
import { animate, stagger } from 'animejs'

document.querySelector('#app').innerHTML = `
  <main class="page">
    <section class="hero">
      <p class="hero-badge">WorldEstate • Nuovi immobili</p>
      <h1 class="hero-title">Trova la casa giusta con un'esperienza più dinamica</h1>
      <p class="hero-subtitle">
        Esplora annunci selezionati, confronta dettagli e contatta gli agenti in pochi secondi.
      </p>
      <button class="hero-cta" type="button">Scopri gli annunci</button>
    </section>

    <section class="listing-section">
      <h2>In evidenza</h2>
      <div class="listing-grid">
        <article class="listing-card">
          <h3>Attico panoramico</h3>
          <p>Milano • 145m² • €1.150.000</p>
        </article>
        <article class="listing-card">
          <h3>Villa con giardino</h3>
          <p>Roma • 220m² • €890.000</p>
        </article>
        <article class="listing-card">
          <h3>Loft moderno</h3>
          <p>Torino • 98m² • €430.000</p>
        </article>
      </div>
    </section>
  </main>
`

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
  animate('.hero-badge', {
    opacity: [0, 1],
    y: [16, 0],
    duration: 700,
    ease: 'out(3)',
  })

  animate('.hero-title, .hero-subtitle, .hero-cta', {
    opacity: [0, 1],
    y: [28, 0],
    delay: stagger(140),
    duration: 900,
    ease: 'outExpo',
  })

  animate('.listing-card', {
    opacity: [0, 1],
    y: [30, 0],
    scale: [0.96, 1],
    delay: stagger(120, { start: 280 }),
    duration: 900,
    ease: 'outExpo',
  })

  animate('.hero-cta', {
    scale: [1, 1.03],
    duration: 1600,
    loop: true,
    alternate: true,
    ease: 'inOutSine',
    delay: 1200,
  })
}
