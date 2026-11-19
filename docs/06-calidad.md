# 06 · Calidad: UX/UI, accesibilidad, rendimiento y SEO

## UX
- La acción principal ("Armar mi pedido" → "Enviar pedido por WhatsApp") se ve en el primer pantallazo y está a un toque en todo momento (nav + botón flotante).
- Botones que dicen exactamente lo que pasa. Nada de "Click acá" ni "Ver más".
- Estados: vacío, con productos, agotado, abierto/cerrado. Todos diseñados.
- Feedback inmediato en cada acción (contador, toast, texto del botón).
- Sin `alert()`, sin modales sorpresa, sin autoplay de sonido ni de carrusel.

## Accesibilidad (WCAG 2.1 AA)
- Un solo `h1`; jerarquía de títulos sin saltos.
- Todo operable con teclado y con foco visible (3 px `--yolk`, offset 3 px).
- Áreas táctiles ≥ 44 × 44 px (los ± del cajón son 32 px: agrandá su área con padding o pseudo-elemento).
- Contraste ≥ 4.5:1 en texto; ≥ 3:1 en íconos y bordes de controles.
- `alt` descriptivo en fotos de producto; `alt=""` en fotos decorativas (hero, proceso).
- Regiones `aria-live` para contador del reloj, toast y estado del cajón.
- `prefers-reduced-motion` respetado en CSS y JS.

## Rendimiento
- Hero: `<Image>` con `loading="eager"`, `fetchpriority="high"`, ancho máximo 1800 px, AVIF/WebP.
- Resto de imágenes `loading="lazy"` con `sizes` correctos.
- Fuentes autohospedadas, solo pesos usados, `font-display: swap`; precargá Fraunces.
- JS total < 15 KB comprimido. Animar solo `transform` y `opacity` (excepción: `font-variation-settings` del titular, limitado a ~25 letras).
- Listeners de scroll y puntero `{ passive: true }` + `requestAnimationFrame`.
- Objetivos en celular: LCP < 2.0 s, CLS < 0.05, INP < 150 ms.

## SEO
- `title` y `meta description` de `03-secciones.md`; OG y Twitter card.
- Schema.org `Bakery` en JSON-LD.
- `lang="es-AR"`, URLs limpias, `robots.txt` y `sitemap` (integración `@astrojs/sitemap` opcional).

## Revisión final
- [ ] 360, 390, 768, 1024, 1280 y 1600 px sin desbordes ni textos cortados.
- [ ] Safari iOS: sticky, `backdrop-filter` y safe areas funcionan.
- [ ] Lighthouse celular ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
