# CLAUDE.md · Miga Panadería (landing de portfolio)

Sos el desarrollador frontend de esta landing. Es una pieza de portfolio de Fermin: tiene que verse como un trabajo terminado para un cliente real, cargar rápido y aguantar que un reclutador la abra en el celular.

## Qué es

Landing de **Miga**, una panadería de masa madre ficticia en Villa Crespo (CABA). Objetivo único de la página: que la persona **arme un pedido y lo mande por WhatsApp**. Todo lo demás (proceso, reseñas, horarios) le da confianza para hacerlo.

## Fuente de verdad

1. `referencia/miga.html`: prototipo funcional aprobado. Abrilo en el navegador antes de empezar. El diseño, los textos y las interacciones salen de acá.
2. `docs/`: especificación. Si el prototipo y los docs no coinciden, **ganan los docs**.
3. `data/*.json`: contenido (productos, horarios, reseñas). No hardcodees ese contenido en los componentes.
4. `public/img/`: fotos de Unsplash ya recortadas. No uses otras.

Leé en orden: `docs/01-brief.md` → `02-diseno.md` → `03-secciones.md` → `04-interacciones.md` → `05-plan.md` → `06-calidad.md`.

## Stack

- **Astro 5** con TypeScript (salida estática). Una página: `src/pages/index.astro`.
- **CSS propio** con variables (tokens de `docs/02-diseno.md`) en `src/styles/tokens.css` y un archivo por componente o `<style>` de Astro con scope. Sin Tailwind ni librerías de UI.
- Interacciones en **TypeScript vanilla** dentro de `<script>` de cada componente. Sin React, sin GSAP, sin jQuery. Si una animación se puede hacer con CSS, va en CSS.
- Fuentes con `@fontsource-variable/fraunces`, `@fontsource/hanken-grotesk` y `@fontsource/jetbrains-mono` (autohospedadas, no Google Fonts por link).
- Imágenes con `astro:assets` (`<Image />`) para generar WebP/AVIF y `srcset`.
- Deploy en **Vercel** (adaptador estático, sin servidor).

## Estructura esperada

```
src/
  pages/index.astro
  layouts/Base.astro          (head, meta, OG, fuentes, skip link)
  components/
    Nav.astro  Hero.astro  Ticker.astro  Rail.astro  ProductCard.astro
    Process.astro  Reviews.astro  Visit.astro  OrderDrawer.astro  Footer.astro
  lib/cart.ts                 (estado del pedido y armado del mensaje de WhatsApp)
  lib/motion.ts               (prefersReducedMotion, helpers de scroll)
  styles/tokens.css  styles/global.css
  data/  → copiá acá los JSON de /data
public/img/ → fotos
```

## Reglas de trabajo

- Trabajá **por etapas** de `docs/05-plan.md`. Al terminar cada etapa: corré `npm run build`, revisá en 390 px y 1280 px, y marcá los criterios de aceptación. No pases a la siguiente con algo roto.
- Commits chicos y en español: `feat(rail): galería horizontal fija`.
- Todo texto visible en **español rioplatense** (vos, tenés, sumá). Copiá los textos de `docs/03-secciones.md`, no los inventes.
- Cada interacción tiene que funcionar con **teclado**, con **lector de pantalla** y con **`prefers-reduced-motion: reduce`** (ver `docs/04-interacciones.md`). Si no podés cumplir eso, simplificá la interacción, no la saltees.
- Nada de `100vh` para alturas de contenido salvo donde el doc lo pide (la galería fija). Usá `svh/dvh` cuando corresponda.
- No agregues dependencias fuera de las listadas sin preguntar.
- Marca y datos son **ficticios**: el footer lo dice. El número de WhatsApp es de ejemplo (`5491100000000`).

## Comandos

```
npm create astro@latest miga -- --template minimal --typescript strict
npm i @fontsource-variable/fraunces @fontsource/hanken-grotesk @fontsource/jetbrains-mono
npm run dev      # http://localhost:4321
npm run build && npm run preview
```

## Definición de terminado

Todos los criterios de `docs/05-plan.md` marcados y los objetivos de `docs/06-calidad.md` cumplidos (Lighthouse ≥ 95 en las cuatro categorías en celular).
